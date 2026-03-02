from mcp.server.fastmcp import FastMCP
from urllib.parse import quote_plus, urlparse
import inspect
from openai import OpenAI
import json
import os
from pathlib import Path
import re
from datetime import datetime, timedelta, timezone
import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from dotenv import load_dotenv
import requests
import hashlib
import time
from collections import defaultdict
from service_extractor import extract_quote_services

try:
    from pymongo import MongoClient, UpdateOne
    PYMONGO_AVAILABLE = True
except ImportError:
    PYMONGO_AVAILABLE = False

try:
    from logger import log_tool_execution as structured_log_tool_execution
except Exception:
    structured_log_tool_execution = None

# Load environment variables from .env file
load_dotenv(Path(__file__).parent / ".env")

# Try to import Groq as fallback
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

# Try to import Google Gemini
from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

DATA_PATH = Path(__file__).parent / "data" / "site_index.json"
LEADS_PATH = Path(__file__).parent / "data" / "leads.json"
CRM_JSON_PATH = Path(__file__).parent / "data" / "crm_leads.json"

# Rate limiting storage
rate_limit_store = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 20  # requests per window

# Token tracking
token_usage = {"total": 0, "by_tool": defaultdict(int)}
MONGO_CLIENT = None
MONGO_DB = None
CRM_MIGRATED = False


def load_docs():
    if not DATA_PATH.exists():
        return []
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip().lower()


def _get_transport_security():
    try:
        from mcp.server.lowlevel.server import TransportSecuritySettings
    except Exception:
        return None

    # Allow explicit disable (useful in managed environments).
    # On Render, default-disable DNS rebinding protection unless explicitly enabled.
    is_render = any(
        os.environ.get(k)
        for k in ("RENDER_EXTERNAL_HOSTNAME", "RENDER", "RENDER_SERVICE_ID")
    )
    if is_render and "MCP_DISABLE_DNS_REBINDING" not in os.environ:
        os.environ["MCP_DISABLE_DNS_REBINDING"] = "true"

    disable = os.environ.get("MCP_DISABLE_DNS_REBINDING", "").strip().lower()
    if disable in ("1", "true", "yes"):
        return TransportSecuritySettings(enable_dns_rebinding_protection=False)

    allowed_hosts = []

    render_host = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
    if render_host:
        allowed_hosts.extend([render_host, f"{render_host}:*"])

    extra_hosts = os.environ.get("MCP_ALLOWED_HOSTS", "")
    for h in [x.strip() for x in extra_hosts.split(",") if x.strip()]:
        allowed_hosts.append(h)

    # If nothing to configure, let FastMCP defaults apply.
    if not allowed_hosts:
        return None

    return TransportSecuritySettings(
        enable_dns_rebinding_protection=True,
        allowed_hosts=allowed_hosts,
    )


def _build_mcp():
    kwargs = {}
    try:
        params = inspect.signature(FastMCP).parameters
        if "transport_security" in params:
            ts = _get_transport_security()
            if ts is not None:
                kwargs["transport_security"] = ts
    except Exception:
        pass

    return FastMCP("CodeSunny MCP", **kwargs)


mcp = _build_mcp()

# Initialize AI clients (try multiple providers)
openai_key = os.environ.get("OPENAI_API_KEY")
groq_key = os.environ.get("GROQ_API_KEY")
gemini_key = os.environ.get("GEMINI_API_KEY")
minmax_key = os.environ.get("MINMAX_API_KEY")

# Debug: Print what keys are found
print(f"Environment keys found:")
print(f"  - OPENAI_API_KEY: {openai_key[:20] if openai_key else 'None'}...")
print(f"  - GROQ_API_KEY: {groq_key[:20] if groq_key else 'None'}...")
print(f"  - GEMINI_API_KEY: {gemini_key[:20] if gemini_key else 'None'}...")
print(f"  - MINMAX_API_KEY: {minmax_key[:20] if minmax_key else 'None'}...")

openai_client = OpenAI(api_key=openai_key) if openai_key and openai_key != "your_openai_api_key_here" and not openai_key.startswith("#") else None
groq_client = Groq(api_key=groq_key) if GROQ_AVAILABLE and groq_key and groq_key != "your_groq_api_key_here" else None

# Initialize Gemini
gemini_client = None
if GEMINI_AVAILABLE and gemini_key and gemini_key != "your_gemini_api_key_here":
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    gemini_client = create_gemini_model(gemini_key, gemini_model)

# Initialize MinMax
minmax_client = None
if minmax_key and minmax_key != "your_minmax_api_key_here":
    minmax_client = "configured"  # We'll use requests library for MinMax

# Use whichever client is available (priority: Groq > Gemini > MinMax > OpenAI)
client = groq_client or gemini_client or minmax_client or openai_client
client_type = "groq" if groq_client else ("gemini" if gemini_client else ("minmax" if minmax_client else ("openai" if openai_client else None)))

# Debug: Print which client is being used
print(f"AI Client initialized: {client_type}")
if client_type:
    print(f"  - OpenAI: {'âœ“' if openai_client else 'âœ—'}")
    print(f"  - Groq: {'âœ“' if groq_client else 'âœ—'}")
    print(f"  - Gemini: {'âœ“' if gemini_client else 'âœ—'}")
    print(f"  - MinMax: {'âœ“' if minmax_client else 'âœ—'}")
else:
    print("  - No AI client available, will use fallback responses")


def rank_docs(query: str, limit: int = 5):
    docs = load_docs()
    q = normalize(query)
    if not q:
        return []
    ranked = []
    for doc in docs:
        hay = normalize(f"{doc.get('title','')} {doc.get('text','')}")
        score = hay.count(q)
        if score > 0:
            ranked.append((score, doc))
    ranked.sort(key=lambda x: x[0], reverse=True)
    return [d[1] for d in ranked[:limit]]


def ensure_leads_store():
    if not LEADS_PATH.exists():
        LEADS_PATH.write_text("[]", encoding="utf-8")


def append_lead(lead):
    ensure_leads_store()
    data = json.loads(LEADS_PATH.read_text(encoding="utf-8"))
    data.append(lead)
    LEADS_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")


def get_mongo_db():
    """Lazy init MongoDB Atlas connection."""
    global MONGO_CLIENT, MONGO_DB
    if MONGO_DB is not None:
        return MONGO_DB

    mongo_uri = os.environ.get("MONGODB_URI", "").strip()
    mongo_db_name = os.environ.get("MONGODB_DB", "codesunny").strip()
    if not mongo_uri or not PYMONGO_AVAILABLE:
        return None

    try:
        MONGO_CLIENT = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        MONGO_CLIENT.admin.command("ping")
        MONGO_DB = MONGO_CLIENT[mongo_db_name]
        return MONGO_DB
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        MONGO_DB = None
        return None


def get_crm_collection():
    db = get_mongo_db()
    if db is None:
        return None
    return db[os.environ.get("MONGODB_CRM_COLLECTION", "crm_leads")]


def _normalize_crm_record(record: dict) -> dict:
    clean = dict(record or {})
    email = (clean.get("email") or "").strip().lower()
    clean["email"] = email
    clean.setdefault("status", "new")
    clean.setdefault("lead_score", 0)
    clean.setdefault("quality", "cold")
    clean.setdefault("created_at", datetime.now(timezone.utc).isoformat() + "Z")
    clean["updated_at"] = datetime.now(timezone.utc).isoformat() + "Z"
    return clean


def _sync_crm_json_from_records(records: list[dict]):
    if os.environ.get("CRM_SYNC_JSON", "false").strip().lower() not in ("1", "true", "yes"):
        return
    try:
        CRM_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
        with CRM_JSON_PATH.open("w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)
    except Exception:
        pass


def migrate_crm_json_to_mongo():
    global CRM_MIGRATED
    if CRM_MIGRATED:
        return

    collection = get_crm_collection()
    if collection is None:
        return

    try:
        has_docs = collection.count_documents({}, limit=1) > 0
        if has_docs:
            CRM_MIGRATED = True
            return
    except Exception:
        return

    if not CRM_JSON_PATH.exists():
        CRM_MIGRATED = True
        return

    try:
        with CRM_JSON_PATH.open("r", encoding="utf-8") as f:
            json_records = json.load(f)
        if not isinstance(json_records, list) or not json_records:
            CRM_MIGRATED = True
            return

        ops = []
        for item in json_records:
            normalized = _normalize_crm_record(item)
            email = normalized.get("email")
            if not email:
                continue
            to_set = dict(normalized)
            created_at = to_set.pop("created_at", datetime.now(timezone.utc).isoformat() + "Z")
            ops.append(
                UpdateOne(
                    {"email": email},
                    {"$set": to_set, "$setOnInsert": {"created_at": created_at}},
                    upsert=True,
                )
            )

        if ops:
            collection.bulk_write(ops, ordered=False)
        CRM_MIGRATED = True
        print(f"Migrated {len(ops)} CRM records from JSON to MongoDB")
    except Exception as e:
        print(f"CRM migration warning: {e}")


def load_crm_leads() -> tuple[list, str]:
    collection = get_crm_collection()
    if collection is None:
        return [], "mongodb_not_configured"

    migrate_crm_json_to_mongo()
    records = []
    for doc in collection.find({}, {"_id": 0}):
        records.append(doc)
    return records, ""


def upsert_crm_lead(record: dict) -> tuple[bool, str]:
    collection = get_crm_collection()
    if collection is None:
        return False, "mongodb_not_configured"

    migrate_crm_json_to_mongo()
    data = _normalize_crm_record(record)
    email = data.get("email")
    if not email:
        return False, "email_required"

    created_at = data.pop("created_at", datetime.now(timezone.utc).isoformat() + "Z")
    collection.update_one(
        {"email": email},
        {"$set": data, "$setOnInsert": {"created_at": created_at}},
        upsert=True,
    )

    leads, _ = load_crm_leads()
    _sync_crm_json_from_records(leads)
    return True, ""


def update_crm_lead_by_email(email: str, updates: dict) -> tuple[bool, str]:
    collection = get_crm_collection()
    if collection is None:
        return False, "mongodb_not_configured"

    migrate_crm_json_to_mongo()
    normalized_email = (email or "").strip().lower()
    if not normalized_email:
        return False, "email_required"

    payload = dict(updates or {})
    payload["updated_at"] = datetime.now(timezone.utc).isoformat() + "Z"
    result = collection.update_one({"email": normalized_email}, {"$set": payload})
    if result.matched_count == 0:
        return False, "lead_not_found"

    leads, _ = load_crm_leads()
    _sync_crm_json_from_records(leads)
    return True, ""


def infer_services_from_message(message: str):
    return extract_quote_services(message)


def extract_quote_services_from_message(message: str):
    """Extract quote services with ecommerce priority."""
    return extract_quote_services(message)


def calculate_lead_score(lead: dict):
    """Simple deterministic lead scoring model."""
    score = 0
    msg = (lead.get("message") or "").lower()
    email = (lead.get("email") or "").lower()
    services = lead.get("services_interested") or []

    if email and "@" in email:
        score += 15
    if msg:
        if len(msg) > 40:
            score += 15
        if len(msg) > 120:
            score += 10
    if services:
        score += min(20, len(services) * 7)

    high_intent_keywords = [
        "quote", "pricing", "budget", "start", "immediately", "urgent",
        "consultation", "call", "meeting", "proposal", "payment",
    ]
    if any(k in msg for k in high_intent_keywords):
        score += 20

    lead_type = "cold"
    if score >= 70:
        lead_type = "hot"
    elif score >= 45:
        lead_type = "warm"
    elif score >= 25:
        lead_type = "cool"
    return score, lead_type


def save_lead_to_mongo(lead: dict):
    """
    Save/update lead in MongoDB.
    Returns (saved: bool, lead_id: str, error: str)
    """
    db = get_mongo_db()
    if db is None:
        return False, "", "mongodb_not_configured"

    try:
        leads_col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
        score, quality = calculate_lead_score(lead)
        lead["lead_score"] = score
        lead["quality"] = quality
        lead["status"] = lead.get("status", "new")
        lead["updated_at"] = datetime.now(timezone.utc).isoformat() + "Z"
        lead.setdefault("automation", {})
        lead["automation"]["follow_up_at"] = (
            datetime.now(timezone.utc) + timedelta(hours=24)
        ).isoformat() + "Z"
        lead["automation"]["next_action"] = (
            "priority_callback" if quality == "hot" else "nurture_followup"
        )

        query = {"email": lead.get("email")}
        set_fields = dict(lead)
        created_at = set_fields.pop("created_at", None)
        update = {
            "$set": set_fields,
            "$setOnInsert": {"created_at": created_at or datetime.now(timezone.utc).isoformat() + "Z"},
        }
        result = leads_col.update_one(query, update, upsert=True)

        doc = leads_col.find_one(query, {"_id": 1})
        lead_id = str(doc["_id"]) if doc and doc.get("_id") is not None else ""
        return True, lead_id, ""
    except Exception as e:
        return False, "", str(e)


def trigger_lead_automation_webhook(lead: dict):
    """Optional webhook trigger for external automations (n8n, Zapier, etc)."""
    webhook = os.environ.get("LEAD_AUTOMATION_WEBHOOK_URL", "").strip()
    if not webhook:
        return False
    try:
        payload = {
            "event": "lead_created",
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
            "lead": lead,
        }
        res = requests.post(webhook, json=payload, timeout=10)
        return res.ok
    except Exception:
        return False


def send_lead_email(lead):
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    email_to = os.environ.get("LEADS_EMAIL_TO")

    if not (host and user and password and email_from and email_to):
        return False

    # Send notification to admin
    admin_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                New Lead from CodeSunny Website
            </h2>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>ðŸ‘¤ Name:</strong> {lead.get('name', 'N/A')}</p>
                <p style="margin: 10px 0;"><strong>ðŸ“§ Email:</strong> 
                    <a href="mailto:{lead.get('email', '')}" style="color: #2563eb;">{lead.get('email', 'N/A')}</a>
                </p>
                <p style="margin: 10px 0;"><strong>ðŸ“… Date:</strong> {lead.get('created_at', 'N/A')}</p>
            </div>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #475569;">ðŸ’¬ Message:</h3>
                <p style="background: #fff; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
                    {lead.get('message', 'No message provided')}
                </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #64748b; font-size: 12px;">
                <p>This lead was captured via the CodeSunny chatbot.</p>
                <p>Reply directly to this email to contact the lead.</p>
            </div>
        </div>
    </body>
    </html>
    """

    # Admin notification
    admin_msg = EmailMessage()
    admin_msg["Subject"] = f"New Lead: {lead.get('name','')} - CodeSunny"
    admin_msg["From"] = email_from
    admin_msg["To"] = email_to
    admin_msg["Reply-To"] = lead.get('email', email_from)
    admin_msg.set_content(f"New lead from {lead.get('name', 'Unknown')}\nEmail: {lead.get('email', 'N/A')}\nMessage: {lead.get('message', 'N/A')}")
    admin_msg.add_alternative(admin_html, subtype='html')

    # Auto-reply to lead
    lead_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2563eb;">Thank You for Contacting CodeSunny</h2>
            
            <p>Hi {lead.get('name', 'there')},</p>
            
            <p>Thank you for reaching out to us! We've received your message and our team will get back to you within 24 hours.</p>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <p style="margin: 0;"><strong>Your Message:</strong></p>
                <p style="margin: 10px 0 0 0;">{lead.get('message', 'No message')}</p>
            </div>
            
            <p>In the meantime, feel free to:</p>
            <ul>
                <li>Call us: +91 89758075789</li>
                <li>Visit: <a href="https://codesunny.com" style="color: #2563eb;">codesunny.com</a></li>
                <li>Email: information@codesunny.in</li>
            </ul>
            
            <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.6;">
                    <strong>CodeSunny Team</strong><br>
                    Web & Digital Solutions<br>
                    Email: <a href="mailto:information@codesunny.in">information@codesunny.in</a> |
                    Phone: <a href="tel:+918975807578">+91 89758075789</a><br>
                    <a href="https://codesunny.com">codesunny.com</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    lead_msg = EmailMessage()
    lead_msg["Subject"] = "Thank You for Contacting CodeSunny!"
    lead_msg["From"] = email_from
    lead_msg["To"] = lead.get('email', '')
    lead_msg["Reply-To"] = email_from
    lead_msg.set_content(f"Hi {lead.get('name', 'there')},\n\nThank you for contacting CodeSunny! We'll get back to you within 24 hours.\n\nBest regards,\nCodeSunny Team")
    lead_msg.add_alternative(lead_html, subtype='html')

    try:
        # Check if using SSL (port 465) or TLS (port 587)
        if port == 465:
            # Use SMTP_SSL for port 465 (Zoho Pro)
            with smtplib.SMTP_SSL(host, port) as server:
                server.login(user, password)
                # Send admin notification
                server.send_message(admin_msg)
                # Send auto-reply to lead
                if lead.get('email'):
                    server.send_message(lead_msg)
        else:
            # Use SMTP with STARTTLS for port 587
            with smtplib.SMTP(host, port) as server:
                server.starttls()
                server.login(user, password)
                # Send admin notification
                server.send_message(admin_msg)
                # Send auto-reply to lead
                if lead.get('email'):
                    server.send_message(lead_msg)
        return True
    except Exception as e:
        print(f"Email send error: {e}")
        return False
        return False


@mcp.tool()
def search(query: str):
    """Search CodeSunny site pages."""
    ranked = rank_docs(query)
    results = [
        {"id": d["id"], "title": d["title"], "url": d["url"]} for d in ranked
    ]

    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps({"results": results}),
            }
        ]
    }


@mcp.tool()
def fetch(id: str):
    """Fetch a page by id."""
    docs = load_docs()
    doc = next((d for d in docs if d.get("id") == id), None)
    if not doc:
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({"error": "not_found", "id": id}),
                }
            ]
        }

    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps(doc),
            }
        ]
    }


@mcp.tool()
def create_lead(name: str, email: str, message: str = ""):
    """Capture a lead, persist to JSON + MongoDB Atlas, and trigger automations."""
    lead = {
        "name": name,
        "email": email,
        "message": message,
        "created_at": datetime.now(timezone.utc).isoformat() + "Z",
    }

    lead["services_interested"] = infer_services_from_message(message)
    score, quality = calculate_lead_score(lead)
    lead["lead_score"] = score
    lead["quality"] = quality
    lead["status"] = "new"

    # Legacy local store (kept for backwards compatibility / backup)
    append_lead(lead)

    # MongoDB Atlas (primary if configured)
    mongo_saved, mongo_lead_id, mongo_error = save_lead_to_mongo(lead)

    emailed = False
    try:
        emailed = send_lead_email(lead)
    except Exception:
        emailed = False

    automation_triggered = trigger_lead_automation_webhook(lead)

    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps(
                    {
                        "status": "received",
                        "emailed": emailed,
                        "mongo_saved": mongo_saved,
                        "mongo_lead_id": mongo_lead_id,
                        "mongo_error": mongo_error if not mongo_saved else "",
                        "automation_triggered": automation_triggered,
                        "lead_score": score,
                        "quality": quality,
                        "status_stage": "new",
                        "services_interested": lead["services_interested"],
                        "name": name,
                        "email": email,
                        "message": message,
                    }
                ),
            }
        ]
    }


@mcp.tool()
def chat(message: str, session_id: str = ""):
    """
    AI chat with CodeSunny context - Powered by Gemini 2.5 Flash
    
    Architecture:
    1. Intent Detection (Gemini) - Understand user's goal
    2. Tool Routing - Execute appropriate action
    3. Response Generation (Gemini) - Natural, contextual replies
    
    This prevents sales-heavy responses and enables proper tool execution.
    """
    # Import Gemini chat handler
    try:
        from gemini_chat_handler import handle_chat_with_gemini
        USE_GEMINI_HANDLER = True
    except ImportError:
        USE_GEMINI_HANDLER = False
        print("âš ï¸ Gemini handler not available, using fallback")
    
    # Import session management
    from session_manager import get_session, add_to_history
    
    # Get or create session
    session = get_session(session_id)
    session_id = session["session_id"]
    
    # Add user message to history
    add_to_history(session_id, "user", message)
    
    print(f"\n{'='*60}")
    print(f"ðŸ“¨ Message: {message}")
    print(f"ðŸ”‘ Session: {session_id}")
    print(f"ðŸ¤– Handler: {'Gemini' if USE_GEMINI_HANDLER else 'Fallback'}")
    print(f"{'='*60}\n")
    
    # Use Gemini handler if available
    if USE_GEMINI_HANDLER:
        try:
            response = handle_chat_with_gemini(message, session)
            
            # Execute tool if action specified
            if response.get("action"):
                response = execute_tool_action(response, session)
            
            # Add assistant response to history
            add_to_history(session_id, "assistant", response["reply"])
            
            # Return formatted response
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "reply": response["reply"],
                        "session_id": session_id,
                        "intent": response.get("intent"),
                        "action": response.get("action"),
                        "confidence": response.get("confidence"),
                        "success": response.get("success"),
                        "images": response.get("images"),
                        "prompt": response.get("prompt"),
                        "original_prompt": response.get("original_prompt"),
                        "style": response.get("style"),
                        "size": response.get("size"),
                        "message": response.get("message"),
                        "error": response.get("error"),
                        "url": response.get("url"),
                        "overall_score": response.get("overall_score"),
                        "metrics": response.get("metrics"),
                        "priority_actions": response.get("priority_actions"),
                        "estimated_improvement": response.get("estimated_improvement"),
                        "meeting": response.get("meeting"),
                        "quote": response.get("quote"),
                    })
                }]
            }
            
        except Exception as e:
            print(f"âŒ Gemini handler error: {e}")
            # Fall through to old handler
    
    # Fallback to old handler
    from intent_router import detect_intent, extract_business_info
    from tool_flows import (
        schedule_meeting_flow, seo_audit_ask_url_flow, seo_audit_execute_flow,
        quote_ask_services_flow, quote_execute_flow, image_ask_prompt_flow,
        image_execute_flow, capture_lead_flow, greeting_flow,
        confirmation_yes_flow, confirmation_no_flow
    )
    
    intent, extracted_data = detect_intent(message, session)
    
    print(f"ðŸŽ¯ Intent: {intent}")
    print(f"ðŸ“¦ Extracted: {extracted_data}")
    
    # Route to appropriate flow (existing logic)
    if intent == "seo_audit_execute":
        response = seo_audit_execute_flow(session, extracted_data["url"], seo_audit)
    elif intent == "seo_audit_ask_url":
        response = seo_audit_ask_url_flow(session)
    elif intent == "schedule_meeting":
        response = schedule_meeting_flow(session, message)
    elif intent == "quote_execute":
        response = quote_execute_flow(session, extracted_data["services"], calculate_quote)
    elif intent == "quote_ask_services":
        response = quote_ask_services_flow(session)
    elif intent == "image_execute":
        response = image_execute_flow(session, extracted_data["prompt"], generate_image)
    elif intent == "image_ask_prompt":
        response = image_ask_prompt_flow(session)
    elif intent == "capture_lead":
        name = extracted_data.get("name", "Prospect")
        email = extracted_data.get("email", "")
        response = capture_lead_flow(session, name, email, message, create_lead)
    elif intent == "confirm_yes":
        response = confirmation_yes_flow(session)
    elif intent == "confirm_no":
        response = confirmation_no_flow(session)
    elif intent == "greeting":
        response = greeting_flow(session)
    elif session.get("stage") == "seo_waiting_url":
        import re
        url_pattern = r'https?://[^\s]+'
        urls = re.findall(url_pattern, message)
        if urls:
            response = seo_audit_execute_flow(session, urls[0], seo_audit)
        else:
            response = {"reply": "Please provide a valid URL (e.g., https://example.com)"}
    elif session.get("stage") == "quote_collecting":
        services = extract_quote_services_from_message(message)
        
        if services:
            response = quote_execute_flow(session, ",".join(services), calculate_quote)
        else:
            response = {"reply": "Please specify which services you need (Website, E-commerce, SEO, Design)"}
    elif session.get("stage") == "image_waiting_prompt":
        response = image_execute_flow(session, message, generate_image)
    else:
        biz_info = extract_business_info(message)
        if biz_info:
            from session_manager import update_session
            for key, value in biz_info.items():
                update_session(session_id, key, value)
            print(f"ðŸ“ Extracted business info: {biz_info}")
        
        from llm_handler import chat_with_llm
        response = chat_with_llm(message, session)
    
    reply_text = response.get("reply", "How can I help you today?")
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps({
                "reply": reply_text,
                "session_id": session_id,
                "action": response.get("action"),
                "next_step": response.get("next_step"),
                "success": response.get("success") or response.get("data", {}).get("success"),
                "images": response.get("images") or response.get("data", {}).get("images"),
                "prompt": response.get("prompt") or response.get("data", {}).get("prompt"),
                "original_prompt": response.get("original_prompt") or response.get("data", {}).get("original_prompt"),
                "style": response.get("style") or response.get("data", {}).get("style"),
                "size": response.get("size") or response.get("data", {}).get("size"),
                "message": response.get("message") or response.get("data", {}).get("message"),
                "error": response.get("error") or response.get("data", {}).get("error"),
                "url": response.get("url") or response.get("data", {}).get("url"),
                "overall_score": response.get("overall_score") or response.get("data", {}).get("overall_score"),
                "metrics": response.get("metrics") or response.get("data", {}).get("metrics"),
                "priority_actions": response.get("priority_actions") or response.get("data", {}).get("priority_actions"),
                "estimated_improvement": response.get("estimated_improvement") or response.get("data", {}).get("estimated_improvement"),
                "meeting": response.get("meeting") or response.get("data", {}).get("meeting"),
                "quote": response.get("quote") or response.get("data", {}).get("quote"),
            })
        }]
    }


def execute_tool_action(response: dict, session: dict) -> dict:
    """
    Execute tool action based on intent
    """
    action = response.get("action")
    data = response.get("data", {})
    
    if action == "seo_audit":
        url = data.get("url")
        if url:
            result = seo_audit(url)
            audit_data = json.loads(result["content"][0]["text"])
            response.update(audit_data)
            response["reply"] += f"\n\nSEO Score: {audit_data.get('overall_score', 0)}/100"
    
    elif action == "generate_image":
        prompt = data.get("prompt")
        if prompt:
            # Call image generation
            result = generate_image(prompt)
            try:
                image_data = json.loads(result["content"][0]["text"])
            except Exception:
                image_data = {}

            # Forward structured image payload so frontend can render images.
            if image_data.get("success") and image_data.get("images"):
                response.update({
                    "success": True,
                    "images": image_data.get("images", []),
                    "prompt": image_data.get("prompt", prompt),
                    "original_prompt": image_data.get("original_prompt", prompt),
                    "style": image_data.get("style", "realistic"),
                    "size": image_data.get("size", "1024x1024")
                })
                response["reply"] += "\n\nImage generated successfully!"
            else:
                if image_data.get("error"):
                    response["reply"] += f"\n\n{image_data.get('message', image_data.get('error'))}"
                else:
                    response["reply"] += "\n\nImage generation failed. Please try again."
    
    elif action == "calculate_quote":
        services = data.get("services")
        if services:
            result = calculate_quote(services)
            quote_data = json.loads(result["content"][0]["text"])
            response["quote"] = quote_data
            response["reply"] += f"\n\nEstimated Cost: INR {quote_data.get('final_price', 0):,}"

    elif action == "schedule_meeting":
        name = (data.get("name") or "").strip()
        email = (data.get("email") or "").strip()
        preferred_datetime = (data.get("preferred_datetime") or "").strip()

        # Do not auto-schedule without required booking details.
        if not (name and email and preferred_datetime):
            response["meeting"] = {
                "status": "pending_details",
                "provider": "google_calendar",
                "message": "Please provide name, email, and preferred date/time to schedule.",
            }
            return response

        result = schedule_consultation_google(
            name=name,
            email=email,
            preferred_datetime=preferred_datetime,
            timezone=data.get("timezone", "Asia/Kolkata"),
            notes=data.get("notes", ""),
        )
        meeting_data = json.loads(result["content"][0]["text"])
        response["meeting"] = meeting_data
        if meeting_data.get("status") == "scheduled":
            link = meeting_data.get("meet_link") or meeting_data.get("event_link") or meeting_data.get("booking_link")
            if link:
                response["reply"] += f"\n\nConsultation scheduled. Link: {link}"
        elif meeting_data.get("booking_link"):
            response["reply"] += f"\n\nBook instantly here: {meeting_data['booking_link']}"
    
    return response


@mcp.tool()
def chat_old(message: str, session_id: str = ""):
    """
    OLD AI chat - kept for backward compatibility
    Production-grade with deterministic routing and session management.
    """
    # Import flow modules
    from session_manager import get_session, add_to_history, get_session_context
    from intent_router import detect_intent, extract_business_info
    from tool_flows import (
        schedule_meeting_flow, seo_audit_ask_url_flow, seo_audit_execute_flow,
        quote_ask_services_flow, quote_execute_flow, image_ask_prompt_flow,
        image_execute_flow, capture_lead_flow, greeting_flow,
        confirmation_yes_flow, confirmation_no_flow
    )
    
    # Get or create session
    session = get_session(session_id)
    session_id = session["session_id"]
    
    # Add user message to history
    add_to_history(session_id, "user", message)
    
    print(f"\n{'='*60}")
    print(f"ðŸ“¨ Message: {message}")
    print(f"ðŸ”‘ Session: {session_id}")
    print(f"ðŸ“Š Stage: {session.get('stage')}")
    print(f"{'='*60}\n")
    
    # ========================================================================
    # STEP 1: DETERMINISTIC INTENT DETECTION (No LLM)
    # ========================================================================
    intent, extracted_data = detect_intent(message, session)
    
    print(f"ðŸŽ¯ Intent: {intent}")
    print(f"ðŸ“¦ Extracted: {extracted_data}")
    
    # ========================================================================
    # STEP 2: ROUTE TO APPROPRIATE FLOW
    # ========================================================================
    
    # SEO Audit Flow
    if intent == "seo_audit_execute":
        response = seo_audit_execute_flow(session, extracted_data["url"], seo_audit)
    
    elif intent == "seo_audit_ask_url":
        response = seo_audit_ask_url_flow(session)
    
    # Meeting Flow
    elif intent == "schedule_meeting":
        response = schedule_meeting_flow(session, message)
    
    # Quote Flow
    elif intent == "quote_execute":
        response = quote_execute_flow(session, extracted_data["services"], calculate_quote)
    
    elif intent == "quote_ask_services":
        response = quote_ask_services_flow(session)
    
    # Image Generation Flow
    elif intent == "image_execute":
        response = image_execute_flow(session, extracted_data["prompt"], generate_image)
    
    elif intent == "image_ask_prompt":
        response = image_ask_prompt_flow(session)
    
    # Lead Capture Flow
    elif intent == "capture_lead":
        name = extracted_data.get("name", "Prospect")
        email = extracted_data.get("email", "")
        response = capture_lead_flow(session, name, email, message, create_lead)
    
    # Confirmation Flows
    elif intent == "confirm_yes":
        response = confirmation_yes_flow(session)
    
    elif intent == "confirm_no":
        response = confirmation_no_flow(session)
    
    # Greeting Flow
    elif intent == "greeting":
        response = greeting_flow(session)
    
    # ========================================================================
    # STEP 3: HANDLE STAGE-BASED CONTINUATION
    # ========================================================================
    elif session.get("stage") == "seo_waiting_url":
        # User provided URL after being asked
        import re
        url_pattern = r'https?://[^\s]+'
        urls = re.findall(url_pattern, message)
        if urls:
            response = seo_audit_execute_flow(session, urls[0], seo_audit)
        else:
            response = {
                "reply": "Please provide a valid URL (e.g., https://example.com)"
            }
    
    elif session.get("stage") == "quote_collecting":
        # User provided services after being asked
        services = extract_quote_services_from_message(message)
        
        if services:
            response = quote_execute_flow(session, ",".join(services), calculate_quote)
        else:
            response = {
                "reply": "Please specify which services you need (Website, E-commerce, SEO, Design)"
            }
    
    elif session.get("stage") == "image_waiting_prompt":
        # User provided image prompt
        response = image_execute_flow(session, message, generate_image)
    
    # ========================================================================
    # STEP 4: EXTRACT BUSINESS INFO (Passive Learning)
    # ========================================================================
    else:
        # Extract any business info from message
        biz_info = extract_business_info(message)
        if biz_info:
            from session_manager import update_session
            for key, value in biz_info.items():
                update_session(session_id, key, value)
            print(f"ðŸ“ Extracted business info: {biz_info}")
        
        # ====================================================================
        # STEP 5: DEFAULT TO LLM (Only for open conversation)
        # ====================================================================
        from llm_handler import chat_with_llm
        response = chat_with_llm(message, session)
    
    # ========================================================================
    # STEP 6: FORMAT AND RETURN RESPONSE
    # ========================================================================
    reply_text = response.get("reply", "How can I help you today?")
    
    # Add session_id to response for frontend
    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps({
                    "reply": reply_text,
                    "session_id": session_id,
                    "action": response.get("action"),
                    "next_step": response.get("next_step")
                })
            }
        ]
    }


@mcp.tool()
def calculate_quote(services: str, requirements: str = ""):
    """
    Calculate project quote based on services and requirements.
    Smart pricing calculator for lead generation.
    
    Args:
        services: Comma-separated list of services (e.g., "ecommerce,seo,ui_ux")
        requirements: Additional requirements or details
    
    Returns:
        Detailed quote with pricing, timeline, and recommendations
    """
    try:
        # Load pricing data
        pricing_file = Path(__file__).parent / "data" / "pricing_data.json"
        if not pricing_file.exists():
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": "Pricing data not available",
                        "message": "Please contact our team for a custom quote"
                    })
                }]
            }
        
        with pricing_file.open("r", encoding="utf-8") as f:
            pricing_data = json.load(f)
        
        # Parse requested services
        requested_services = [s.strip().lower() for s in services.split(",")]
        
        quote = {
            "services": [],
            "total_price": 0,
            "estimated_duration": "",
            "recommendations": []
        }
        
        # Calculate pricing
        for service in requested_services:
            if "ecommerce" in service or "e-commerce" in service:
                svc = pricing_data["services"]["web_development"]["ecommerce"]
                quote["services"].append(svc)
                quote["total_price"] += svc["price"]
                
            elif "seo" in service:
                svc = pricing_data["services"]["seo_optimization"]["advanced"]
                quote["services"].append(svc)
                quote["total_price"] += svc["price"]
                quote["recommendations"].append("SEO works best with ongoing optimization")
                
            elif "ui" in service or "ux" in service or "design" in service:
                svc = pricing_data["services"]["ui_ux_design"]["standard"]
                quote["services"].append(svc)
                quote["total_price"] += svc["price"]
                
            elif "cloud" in service or "hosting" in service:
                svc = pricing_data["services"]["cloud_solutions"]["small"]
                quote["services"].append(svc)
                quote["total_price"] += svc["price"]
                
            elif "website" in service or "web" in service:
                svc = pricing_data["services"]["web_development"]["basic"]
                quote["services"].append(svc)
                quote["total_price"] += svc["price"]

            elif "marketing" in service:
                # Marketing estimate mapped to monthly digital growth package.
                svc = {
                    "name": "Digital Marketing",
                    "price": 25000,
                    "duration": "monthly retainer",
                    "description": "Campaign setup, ads optimization, and monthly reporting",
                }
                quote["services"].append(svc)
                quote["total_price"] += svc["price"]
                quote["recommendations"].append("Marketing works best as a 3+ month engagement")

            elif "automation" in service or "ai" in service or "chatbot" in service:
                svc = {
                    "name": "AI Solutions & Chatbots",
                    "price": 45000,
                    "duration": "4-8 weeks",
                    "description": "AI chatbot/automation setup with workflow integration",
                }
                quote["services"].append(svc)
                quote["total_price"] += svc["price"]
                quote["recommendations"].append("AI scope varies by integrations and data requirements")
        
        # Add recommendations
        if len(quote["services"]) > 1:
            discount = int(quote["total_price"] * 0.1)
            quote["discount"] = discount
            quote["final_price"] = quote["total_price"] - discount
            quote["recommendations"].append(f"Bundle discount: â‚¹{discount:,} off!")
        else:
            quote["final_price"] = quote["total_price"]
        
        # Estimate duration
        if len(quote["services"]) == 1:
            quote["estimated_duration"] = quote["services"][0].get("duration", "4-6 weeks")
        else:
            quote["estimated_duration"] = "6-12 weeks (depending on complexity)"
        
        # Add maintenance recommendation
        quote["recommendations"].append("Consider monthly maintenance for â‚¹5,000/month")

        # Optional: log quote requests to Google Sheets (Apps Script webhook)
        sheets_webhook = os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()
        quote["google_sheets_logged"] = False
        if sheets_webhook:
            try:
                webhook_payload = {
                    "source": "codesunny_mcp",
                    "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
                    "services": services,
                    "requirements": requirements,
                    "total_price": quote.get("total_price", 0),
                    "final_price": quote.get("final_price", 0),
                    "estimated_duration": quote.get("estimated_duration", ""),
                }
                hook_res = requests.post(sheets_webhook, json=webhook_payload, timeout=12)
                quote["google_sheets_logged"] = hook_res.ok
            except Exception:
                quote["google_sheets_logged"] = False
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(quote, indent=2)
            }]
        }
        
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "Quote calculation failed",
                    "message": str(e)
                })
            }]
        }


@mcp.tool()
def seo_audit(url: str):
    """
    Perform SEO audit using Google PageSpeed Insights API.
    Falls back to a safe report if Google API is unavailable.
    """
    try:
        target_url = (url or "").strip()
        if not target_url:
            raise ValueError("URL is required")
        if not target_url.startswith(("http://", "https://")):
            target_url = f"https://{target_url}"

        pagespeed_key = os.environ.get("GOOGLE_PAGESPEED_API_KEY", "").strip()
        if not pagespeed_key:
            raise ValueError("GOOGLE_PAGESPEED_API_KEY is not configured")

        endpoint = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
        categories = ["performance", "seo", "best-practices", "accessibility"]

        def run_strategy(strategy: str):
            params = {
                "url": target_url,
                "key": pagespeed_key,
                "strategy": strategy,
                "category": categories,
            }
            return requests.get(endpoint, params=params, timeout=45)

        mobile_res = run_strategy("mobile")
        desktop_res = run_strategy("desktop")

        if not mobile_res.ok:
            raise ValueError(f"PageSpeed mobile API failed: {mobile_res.status_code}")
        if not desktop_res.ok:
            raise ValueError(f"PageSpeed desktop API failed: {desktop_res.status_code}")

        mobile = mobile_res.json().get("lighthouseResult", {})
        desktop = desktop_res.json().get("lighthouseResult", {})

        def score_from(lhr: dict, category: str) -> int:
            score = lhr.get("categories", {}).get(category, {}).get("score")
            if score is None:
                return 0
            return int(round(float(score) * 100))

        perf_score = score_from(mobile, "performance")
        seo_score = score_from(mobile, "seo")
        mobile_score = int(round((perf_score + score_from(desktop, "performance")) / 2))
        security_score = score_from(desktop, "best-practices")

        audits = mobile.get("audits", {})
        perf_ids = [
            "largest-contentful-paint",
            "first-contentful-paint",
            "speed-index",
            "total-blocking-time",
            "cumulative-layout-shift",
        ]
        seo_ids = [
            "meta-description",
            "document-title",
            "link-text",
            "crawlable-anchors",
            "is-crawlable",
        ]

        def collect_issues(ids):
            issues = []
            for aid in ids:
                item = audits.get(aid, {})
                score = item.get("score")
                if score is not None and score < 0.9:
                    title = item.get("title", aid)
                    display = item.get("displayValue", "")
                    issues.append(f"{title}{': ' + display if display else ''}")
            return issues[:4]

        performance_issues = collect_issues(perf_ids)
        seo_issues = collect_issues(seo_ids)

        priority_actions = [f"- {x}" for x in (performance_issues + seo_issues)[:4]]
        if not priority_actions:
            priority_actions = [
                "- Improve Core Web Vitals (LCP, CLS, INP)",
                "- Add/optimize metadata and schema markup",
            ]

        overall_score = int(round((perf_score + seo_score + mobile_score + security_score) / 4))

        audit_report = {
            "source": "google_pagespeed",
            "url": target_url,
            "overall_score": overall_score,
            "metrics": {
                "performance": {
                    "score": perf_score,
                    "issues": performance_issues or ["No major performance issues detected"],
                    "recommendations": [
                        "Optimize images and serve next-gen formats",
                        "Reduce render-blocking resources",
                        "Improve caching and compression",
                    ],
                },
                "seo": {
                    "score": seo_score,
                    "issues": seo_issues or ["No major SEO issues detected"],
                    "recommendations": [
                        "Add complete meta tags and structured data",
                        "Improve internal linking and crawlability",
                        "Ensure descriptive titles and headings",
                    ],
                },
                "mobile": {
                    "score": mobile_score,
                    "issues": ["Review mobile usability and touch target sizes"],
                    "recommendations": ["Use responsive layout and optimize fonts/buttons"],
                },
                "security": {
                    "score": security_score,
                    "issues": [],
                    "recommendations": ["Keep HTTPS and security headers enabled"],
                },
            },
            "priority_actions": priority_actions,
            "estimated_improvement": "Fixing high-impact items can improve score by 10-25 points.",
            "cta": "Want us to implement these fixes? We can prepare a prioritized SEO action plan.",
        }

    except Exception as e:
        audit_report = {
            "source": "fallback",
            "url": url,
            "overall_score": 72,
            "metrics": {
                "performance": {
                    "score": 65,
                    "issues": ["Unable to fetch live Google PageSpeed data"],
                    "recommendations": ["Re-run with a valid public URL and API key"],
                },
                "seo": {
                    "score": 78,
                    "issues": ["Live SEO checks unavailable right now"],
                    "recommendations": ["Retry after checking API key and URL reachability"],
                },
                "mobile": {
                    "score": 85,
                    "issues": [],
                    "recommendations": ["Validate mobile usability in Search Console"],
                },
                "security": {
                    "score": 90,
                    "issues": [],
                    "recommendations": ["Verify HTTPS and security headers"],
                },
            },
            "priority_actions": [
                "- Verify GOOGLE_PAGESPEED_API_KEY",
                "- Ensure URL is publicly accessible",
                "- Retry audit",
            ],
            "estimated_improvement": "Live audit unavailable; fallback report generated.",
            "cta": f"Google audit fallback used: {str(e)}",
        }

    return {
        "content": [{
            "type": "text",
            "text": json.dumps(audit_report, indent=2)
        }]
    }


@mcp.tool()
def schedule_consultation_google(
    name: str = "",
    email: str = "",
    preferred_datetime: str = "",
    timezone: str = "Asia/Kolkata",
    notes: str = "",
):
    """
    Schedule consultation via Google Calendar webhook (Apps Script/Cloud Run).
    Configure GOOGLE_CALENDAR_WEBHOOK_URL to enable auto-booking.
    """
    webhook = os.environ.get("GOOGLE_CALENDAR_WEBHOOK_URL", "").strip()
    booking_link = "https://codesunny.com/book-call"

    from datetime import timezone as dt_timezone

    payload = {
        "source": "codesunny_mcp",
        "name": name,
        "email": email,
        "preferred_datetime": preferred_datetime,
        "timezone": timezone,
        "notes": notes,
        "created_at": datetime.now(dt_timezone.utc).isoformat() + "Z",
    }

    if webhook:
        try:
            res = requests.post(webhook, json=payload, timeout=15)
            if res.ok:
                data = {}
                try:
                    data = res.json()
                except Exception:
                    data = {}
                result = {
                    "status": "scheduled",
                    "provider": "google_calendar",
                    "booking_link": data.get("booking_link", booking_link),
                    "event_link": data.get("event_link", ""),
                    "meet_link": data.get("meet_link", ""),
                    "message": "Consultation scheduled via Google Calendar.",
                }
                return {"content": [{"type": "text", "text": json.dumps(result, indent=2)}]}
        except Exception:
            pass

    result = {
        "status": "pending_details",
        "provider": "google_calendar",
        "booking_link": booking_link,
        "message": "Google Calendar webhook not configured or unavailable. Please complete booking via link.",
    }
    return {"content": [{"type": "text", "text": json.dumps(result, indent=2)}]}


@mcp.tool()
def cloud_calculator(traffic: str, storage: str = "50GB", region: str = "asia"):
    """
    Calculate cloud infrastructure requirements and costs.
    Helps clients understand cloud hosting needs.
    
    Args:
        traffic: Expected monthly traffic (e.g., "10000 visitors", "high", "medium", "low")
        storage: Storage requirements (e.g., "50GB", "100GB")
        region: Deployment region (asia, us, europe)
    
    Returns:
        Cloud infrastructure recommendation with pricing
    """
    # Parse traffic
    if "high" in traffic.lower() or "100000" in traffic or "1 lakh" in traffic.lower():
        tier = "enterprise"
        visitors = "100,000+"
    elif "medium" in traffic.lower() or "50000" in traffic:
        tier = "business"
        visitors = "50,000"
    else:
        tier = "startup"
        visitors = "10,000"
    
    recommendations = {
        "startup": {
            "name": "Startup Plan",
            "monthly_cost": 5000,
            "specs": {
                "server": "2 vCPU, 4GB RAM",
                "storage": "50GB SSD",
                "bandwidth": "1TB/month",
                "ssl": "Free SSL certificate",
                "backup": "Daily backups"
            },
            "suitable_for": "Up to 10,000 monthly visitors"
        },
        "business": {
            "name": "Business Plan",
            "monthly_cost": 15000,
            "specs": {
                "server": "4 vCPU, 8GB RAM",
                "storage": "100GB SSD",
                "bandwidth": "5TB/month",
                "ssl": "Premium SSL",
                "backup": "Hourly backups",
                "cdn": "Global CDN included"
            },
            "suitable_for": "Up to 50,000 monthly visitors"
        },
        "enterprise": {
            "name": "Enterprise Plan",
            "monthly_cost": 50000,
            "specs": {
                "server": "8 vCPU, 16GB RAM (Auto-scaling)",
                "storage": "500GB SSD",
                "bandwidth": "Unlimited",
                "ssl": "Premium SSL with monitoring",
                "backup": "Real-time backups",
                "cdn": "Multi-region CDN",
                "load_balancer": "Included",
                "monitoring": "24/7 monitoring & alerts"
            },
            "suitable_for": "100,000+ monthly visitors"
        }
    }
    
    selected_plan = recommendations[tier]
    
    result = {
        "recommended_plan": selected_plan,
        "expected_traffic": visitors,
        "region": region,
        "setup_cost": 20000,
        "first_year_cost": selected_plan["monthly_cost"] * 12 + 20000,
        "benefits": [
            "99.9% uptime guarantee",
            "Free SSL certificate",
            "Automatic backups",
            "24/7 technical support",
            "Easy scaling as you grow"
        ],
        "next_steps": [
            "1. Share your project requirements",
            "2. We'll create a custom architecture diagram",
            "3. Setup and deployment in 1 week",
            "4. Free 1-month monitoring included"
        ]
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(result, indent=2)
        }]
    }


@mcp.tool()
def project_status(client_name: str = "", project_id: str = ""):
    """
    Check project status for existing clients.
    Provides real-time project updates.
    
    Args:
        client_name: Client's name or company name
        project_id: Project ID (if known)
    
    Returns:
        Project status, progress, and next milestones
    """
    try:
        projects_file = Path(__file__).parent / "data" / "projects_data.json"
        if not projects_file.exists():
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "message": "Please contact our team for project status updates",
                        "email": "projects@codesunny.com",
                        "phone": "+91-XXXXXXXXXX"
                    })
                }]
            }
        
        with projects_file.open("r", encoding="utf-8") as f:
            projects_data = json.load(f)
        
        # Search for project
        found_project = None
        for project in projects_data["ongoing_projects"]:
            if (client_name.lower() in project["client_name"].lower()) or \
               (project_id and project_id == project["id"]):
                found_project = project
                break
        
        if found_project:
            status_report = {
                "project_found": True,
                "client": found_project["client_name"],
                "project_type": found_project["type"],
                "status": found_project["status"],
                "progress": f"{found_project['progress']}% complete",
                "current_phase": found_project["current_phase"],
                "estimated_completion": found_project["estimated_completion"],
                "next_milestone": found_project["next_milestone"],
                "message": f"Your project is {found_project['progress']}% complete. Currently working on: {found_project['current_phase']}"
            }
        else:
            status_report = {
                "project_found": False,
                "message": "Project not found. Please provide your project ID or contact our team.",
                "contact": "projects@codesunny.com"
            }
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(status_report, indent=2)
            }]
        }
        
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "Status check failed",
                    "message": "Please contact our team directly"
                })
            }]
        }


@mcp.tool()
def generate_image(prompt: str, style: str = "photo", size: str = "1024x1024"):
    """
    Generate AI images using Freepik API based on text prompts.
    Perfect for creating visuals for websites, marketing, social media.
    
    Args:
        prompt: Description of the image to generate (e.g., "modern website hero image")
        style: Image style - realistic, digital-art, illustration, 3d-render, anime
        size: Image size - 512x512, 1024x1024, 1024x1792 (portrait), 1792x1024 (landscape)
    
    Returns:
        Generated image URL and details
    """
    freepik_api_key = os.environ.get("FREEPIK_API_KEY")

    def build_fallback_image(reason: str, final_prompt: str):
        safe_prompt = quote_plus((final_prompt or prompt)[:400])
        fallback_url = (
            f"https://image.pollinations.ai/prompt/{safe_prompt}"
            f"?width=1344&height=768&nologo=true&seed={int(time.time())}"
        )
        fallback_payload = {
            "success": True,
            "source": "fallback",
            "prompt": final_prompt or prompt,
            "original_prompt": prompt,
            "style": style,
            "size": size,
            "images": [{"url": fallback_url}],
            "message": f"Image generated with fallback provider ({reason}).",
        }
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(fallback_payload, indent=2)
            }]
        }
    
    # If Freepik key is missing, use fallback so users still get an image.
    if not freepik_api_key or freepik_api_key == "your_freepik_api_key_here":
        return build_fallback_image("missing_freepik_key", prompt)
    
    try:
        freepik_url = os.environ.get("FREEPIK_API_URL", "https://api.freepik.com/v1/ai/text-to-image")
        
        headers = {
            "x-freepik-api-key": freepik_api_key,
            "Content-Type": "application/json"
        }
        
        # Use Groq to enhance the prompt
        if groq_client:
            try:
                enhancement_prompt = f"Enhance this image generation prompt to be more detailed and specific: '{prompt}'. Return only the enhanced prompt, nothing else."
                response = groq_client.chat.completions.create(
                    model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                    messages=[{"role": "user", "content": enhancement_prompt}],
                    temperature=0.7,
                    max_tokens=150
                )
                enhanced_prompt = response.choices[0].message.content.strip()
                print(f"Enhanced prompt: {enhanced_prompt}")
            except Exception:
                enhanced_prompt = prompt
        else:
            enhanced_prompt = prompt
        
        style_map = {
            "realistic": "photo",
            "realistic-photo": "photo",
            "digital-art": "digital-art",
            "illustration": "illustration",
            "3d-render": "3d",
            "3d": "3d",
            "anime": "anime",
            "photo": "photo",
        }
        freepik_style = style_map.get((style or "").strip().lower(), "photo")

        payload = {
            "prompt": enhanced_prompt,
            "negative_prompt": "blurry, low quality, distorted, ugly",
            "styling": {
                "style": freepik_style,
            },
            "image": {
                "size": size
            },
            "num_images": 1
        }
        
        print("Freepik API Request:")
        print(f"  Prompt: {enhanced_prompt}")
        print(f"  Style: {style} -> {freepik_style}")
        print(f"  Size: {size}")
        
        response = requests.post(freepik_url, headers=headers, json=payload, timeout=90)
        
        print("Freepik API Response:")
        print(f"  Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            result = {
                "success": True,
                "prompt": enhanced_prompt,
                "original_prompt": prompt,
                "style": freepik_style,
                "size": size,
                "images": data.get("data", []),
                "message": "Image generated successfully!",
                "usage_tip": "You can use this image for your website, marketing materials, or social media"
            }
            
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps(result, indent=2)
                }]
            }
        
        error_data = response.json() if response.text else {}
        error_message = error_data.get("message", f"Freepik API error: {response.status_code}")
        print(f"Freepik image error: {error_message}")
        return build_fallback_image(f"freepik_{response.status_code}", enhanced_prompt)
            
    except requests.exceptions.Timeout:
        return build_fallback_image("freepik_timeout", prompt)
    except Exception as e:
        print(f"Image generation error: {str(e)}")
        return build_fallback_image("freepik_exception", prompt)


@mcp.tool()
def generate_proposal(
    client_name: str,
    business_type: str,
    services: str,
    budget: str = "",
    timeline: str = "",
    requirements: str = ""
):
    """
    Generate professional project proposal with AI.
    Creates detailed scope, timeline, and pricing.
    
    Args:
        client_name: Client's name or company name
        business_type: Type of business (e.g., "restaurant", "ecommerce", "saas")
        services: Comma-separated services (e.g., "web,seo,design")
        budget: Budget range (optional)
        timeline: Expected timeline (optional)
        requirements: Additional requirements (optional)
    
    Returns:
        Structured proposal with scope, tech stack, timeline, pricing
    """
    try:
        # Load pricing data
        pricing_file = Path(__file__).parent / "data" / "pricing_data.json"
        pricing_data = {}
        if pricing_file.exists():
            with pricing_file.open("r", encoding="utf-8") as f:
                pricing_data = json.load(f)
        
        # Parse services
        service_list = [s.strip().lower() for s in services.split(",")]
        
        # Build proposal using AI
        if client and client_type in ["groq", "openai", "gemini"]:
            proposal_prompt = f"""Generate a professional project proposal for:
Client: {client_name}
Business Type: {business_type}
Services Requested: {services}
Budget: {budget if budget else 'To be discussed'}
Timeline: {timeline if timeline else 'Flexible'}
Requirements: {requirements if requirements else 'Standard features'}

Create a structured proposal with:
1. Executive Summary
2. Recommended Tech Stack
3. Project Scope & Features
4. Timeline & Milestones
5. Investment & ROI

Keep it professional, concise, and value-focused."""

            try:
                if client_type == "groq":
                    response = groq_client.chat.completions.create(
                        model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                        messages=[{"role": "user", "content": proposal_prompt}],
                        temperature=0.3,
                        max_tokens=1000
                    )
                    ai_proposal = response.choices[0].message.content
                elif client_type == "gemini":
                    response = gemini_client.generate_content(proposal_prompt)
                    ai_proposal = response.text
                else:
                    response = openai_client.chat.completions.create(
                        model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                        messages=[{"role": "user", "content": proposal_prompt}],
                        temperature=0.3
                    )
                    ai_proposal = response.choices[0].message.content
            except:
                ai_proposal = "AI proposal generation temporarily unavailable"
        else:
            ai_proposal = "AI proposal generation not configured"
        
        # Calculate estimated pricing
        total_estimate = 0
        service_breakdown = []
        
        for service in service_list:
            if "web" in service or "website" in service:
                total_estimate += 50000
                service_breakdown.append({"service": "Web Development", "estimate": "â‚¹50,000"})
            if "ecommerce" in service or "e-commerce" in service:
                total_estimate += 75000
                service_breakdown.append({"service": "E-commerce Platform", "estimate": "â‚¹75,000"})
            if "seo" in service:
                total_estimate += 35000
                service_breakdown.append({"service": "SEO Optimization", "estimate": "â‚¹35,000"})
            if "design" in service or "ui" in service or "ux" in service:
                total_estimate += 30000
                service_breakdown.append({"service": "UI/UX Design", "estimate": "â‚¹30,000"})
            if "cloud" in service or "hosting" in service:
                total_estimate += 20000
                service_breakdown.append({"service": "Cloud Setup", "estimate": "â‚¹20,000"})
        
        # Apply bundle discount
        if len(service_breakdown) > 1:
            discount = int(total_estimate * 0.1)
            final_price = total_estimate - discount
        else:
            discount = 0
            final_price = total_estimate
        
        proposal = {
            "client_name": client_name,
            "business_type": business_type,
            "generated_at": datetime.now(timezone.utc).isoformat() + "Z",
            "ai_proposal": ai_proposal,
            "service_breakdown": service_breakdown,
            "pricing": {
                "subtotal": f"â‚¹{total_estimate:,}",
                "discount": f"â‚¹{discount:,}" if discount > 0 else "â‚¹0",
                "total": f"â‚¹{final_price:,}"
            },
            "estimated_timeline": timeline if timeline else "8-12 weeks",
            "next_steps": [
                "1. Review this proposal",
                "2. Schedule discovery call",
                "3. Finalize scope & contract",
                "4. Project kickoff"
            ],
            "validity": "This proposal is valid for 30 days",
            "contact": {
                "email": "hello@codesunny.com",
                "phone": "+91-XXXXXXXXXX"
            }
        }
        
        # Save proposal
        proposals_dir = Path(__file__).parent / "data" / "proposals"
        proposals_dir.mkdir(exist_ok=True)
        
        proposal_file = proposals_dir / f"proposal_{client_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        proposal_file.write_text(json.dumps(proposal, indent=2), encoding="utf-8")
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(proposal, indent=2)
            }]
        }
        
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "Proposal generation failed",
                    "message": str(e)
                })
            }]
        }


@mcp.tool()
def advanced_pricing_calculator(
    features: str,
    complexity: str = "medium",
    integrations: str = "",
    timeline_urgency: str = "normal"
):
    """
    Advanced feature-based pricing calculator.
    Calculates pricing based on features, complexity, and timeline.
    
    Args:
        features: Comma-separated features (e.g., "user_auth,payment,admin_panel,api")
        complexity: Project complexity - simple, medium, complex, enterprise
        integrations: Third-party integrations (e.g., "stripe,mailchimp,analytics")
        timeline_urgency: Timeline urgency - normal, urgent (adds 20% rush fee)
    
    Returns:
        Detailed pricing breakdown with feature costs
    """
    # Feature pricing matrix
    feature_prices = {
        "user_auth": 8000,
        "payment": 12000,
        "admin_panel": 15000,
        "api": 10000,
        "dashboard": 12000,
        "analytics": 8000,
        "notifications": 6000,
        "search": 7000,
        "chat": 10000,
        "file_upload": 5000,
        "email_system": 6000,
        "sms": 5000,
        "social_login": 4000,
        "multi_language": 8000,
        "mobile_app": 50000,
        "pwa": 15000
    }
    
    # Integration pricing
    integration_prices = {
        "stripe": 8000,
        "razorpay": 7000,
        "paypal": 8000,
        "mailchimp": 5000,
        "sendgrid": 5000,
        "twilio": 6000,
        "google_analytics": 3000,
        "facebook_pixel": 3000,
        "aws": 10000,
        "firebase": 8000
    }
    
    # Complexity multipliers
    complexity_multipliers = {
        "simple": 1.0,
        "medium": 1.3,
        "complex": 1.6,
        "enterprise": 2.0
    }
    
    # Parse features
    feature_list = [f.strip().lower() for f in features.split(",")]
    integration_list = [i.strip().lower() for i in integrations.split(",")] if integrations else []
    
    # Calculate base cost
    base_cost = 25000  # Base website cost
    feature_cost = sum(feature_prices.get(f, 5000) for f in feature_list)
    integration_cost = sum(integration_prices.get(i, 5000) for i in integration_list)
    
    subtotal = base_cost + feature_cost + integration_cost
    
    # Apply complexity multiplier
    multiplier = complexity_multipliers.get(complexity.lower(), 1.3)
    adjusted_cost = int(subtotal * multiplier)
    
    # Apply urgency fee
    rush_fee = 0
    if timeline_urgency.lower() == "urgent":
        rush_fee = int(adjusted_cost * 0.2)
        final_cost = adjusted_cost + rush_fee
    else:
        final_cost = adjusted_cost
    
    # Calculate timeline
    base_weeks = 4
    feature_weeks = len(feature_list) * 0.5
    integration_weeks = len(integration_list) * 0.3
    complexity_weeks = {"simple": 0, "medium": 2, "complex": 4, "enterprise": 8}.get(complexity.lower(), 2)
    
    total_weeks = int(base_weeks + feature_weeks + integration_weeks + complexity_weeks)
    
    if timeline_urgency.lower() == "urgent":
        total_weeks = int(total_weeks * 0.7)  # Faster delivery
    
    breakdown = {
        "base_cost": f"â‚¹{base_cost:,}",
        "features": [
            {"name": f, "cost": f"â‚¹{feature_prices.get(f, 5000):,}"}
            for f in feature_list
        ],
        "integrations": [
            {"name": i, "cost": f"â‚¹{integration_prices.get(i, 5000):,}"}
            for i in integration_list
        ],
        "complexity": {
            "level": complexity,
            "multiplier": f"{multiplier}x",
            "impact": f"â‚¹{adjusted_cost - subtotal:,}"
        },
        "urgency": {
            "level": timeline_urgency,
            "rush_fee": f"â‚¹{rush_fee:,}" if rush_fee > 0 else "â‚¹0"
        },
        "pricing_summary": {
            "subtotal": f"â‚¹{subtotal:,}",
            "after_complexity": f"â‚¹{adjusted_cost:,}",
            "final_price": f"â‚¹{final_cost:,}"
        },
        "estimated_timeline": f"{total_weeks} weeks",
        "payment_terms": "30% advance, 40% mid-project, 30% on delivery",
        "includes": [
            "Source code ownership",
            "3 months free support",
            "Deployment assistance",
            "Documentation"
        ]
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(breakdown, indent=2)
        }]
    }


@mcp.tool()
def send_auto_response(lead_email: str, lead_name: str, inquiry_type: str = "general"):
    """
    Send automated email response to leads.
    Provides instant acknowledgment and next steps.
    
    Args:
        lead_email: Lead's email address
        lead_name: Lead's name
        inquiry_type: Type of inquiry - general, quote, support, partnership
    
    Returns:
        Email send status
    """
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    
    if not (host and user and password and email_from):
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "status": "email_not_configured",
                    "message": "Auto-response email not sent (SMTP not configured)"
                })
            }]
        }
    
    # Email templates based on inquiry type
    templates = {
        "general": {
            "subject": "Thanks for reaching out to CodeSunny! ðŸš€",
            "body": f"""Hi {lead_name},

Thank you for contacting CodeSunny! We've received your inquiry and our team will get back to you within 24 hours.

In the meantime, here's what you can do:
â€¢ Explore our services: https://codesunny.com/services
â€¢ Check our portfolio: https://codesunny.com/portfolio
â€¢ Read client testimonials: https://codesunny.com/testimonials

Need immediate assistance? Reply to this email or call us at +91-XXXXXXXXXX

Best regards,
CodeSunny Team
https://codesunny.com"""
        },
        "quote": {
            "subject": "Your Project Quote from CodeSunny ðŸ’¼",
            "body": f"""Hi {lead_name},

Thanks for requesting a quote! We're excited to work with you.

Our team is preparing a detailed proposal based on your requirements. You'll receive it within 24-48 hours.

What happens next:
1. Review the proposal
2. Schedule a discovery call
3. Finalize scope & timeline
4. Project kickoff!

Questions? Reply to this email anytime.

Best regards,
CodeSunny Team
https://codesunny.com"""
        },
        "support": {
            "subject": "CodeSunny Support - We're Here to Help! ðŸ› ï¸",
            "body": f"""Hi {lead_name},

We've received your support request and our technical team is on it!

Expected response time: 2-4 hours (business hours)

For urgent issues, please call: +91-XXXXXXXXXX

Best regards,
CodeSunny Support Team"""
        }
    }
    
    template = templates.get(inquiry_type, templates["general"])
    
    try:
        msg = EmailMessage()
        msg["Subject"] = template["subject"]
        msg["From"] = email_from
        msg["To"] = lead_email
        msg["Reply-To"] = email_from
        msg.set_content(template["body"])
        
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "status": "sent",
                    "message": f"Auto-response sent to {lead_email}",
                    "type": inquiry_type
                })
            }]
        }
        
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "status": "failed",
                    "error": str(e)
                })
            }]
        }


@mcp.tool()
def check_server_health(domain: str = ""):
    """
    Check server health, uptime, and SSL status.
    DevOps monitoring tool for client websites.
    
    Args:
        domain: Website domain to check (e.g., "codesunny.com")
    
    Returns:
        Server health report with uptime, SSL, DNS status
    """
    if not domain:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "Domain required",
                    "message": "Please provide a domain name to check"
                })
            }]
        }
    
    # Add https:// if not present
    if not domain.startswith("http"):
        url = f"https://{domain}"
    else:
        url = domain
    
    health_report = {
        "domain": domain,
        "checked_at": datetime.now(timezone.utc).isoformat() + "Z",
        "status": "unknown",
        "checks": {}
    }
    
    try:
        # Check if site is reachable
        response = requests.get(url, timeout=10, allow_redirects=True)
        health_report["checks"]["reachability"] = {
            "status": "âœ“ Online",
            "response_time": f"{response.elapsed.total_seconds():.2f}s",
            "status_code": response.status_code
        }
        
        # Check SSL
        if url.startswith("https"):
            health_report["checks"]["ssl"] = {
                "status": "âœ“ SSL Active",
                "message": "HTTPS is properly configured"
            }
        else:
            health_report["checks"]["ssl"] = {
                "status": "âœ— No SSL",
                "message": "Consider enabling HTTPS for security"
            }
        
        # Check response headers
        headers = response.headers
        health_report["checks"]["security_headers"] = {
            "x-frame-options": "âœ“" if "X-Frame-Options" in headers else "âœ—",
            "x-content-type-options": "âœ“" if "X-Content-Type-Options" in headers else "âœ—",
            "strict-transport-security": "âœ“" if "Strict-Transport-Security" in headers else "âœ—"
        }
        
        # Overall status
        if response.status_code == 200:
            health_report["status"] = "healthy"
            health_report["message"] = "All systems operational"
        else:
            health_report["status"] = "warning"
            health_report["message"] = f"Site returned status code {response.status_code}"
        
        # Recommendations
        recommendations = []
        if not url.startswith("https"):
            recommendations.append("Enable HTTPS/SSL certificate")
        if "X-Frame-Options" not in headers:
            recommendations.append("Add X-Frame-Options header for security")
        if response.elapsed.total_seconds() > 3:
            recommendations.append("Optimize page load time (currently > 3s)")
        
        health_report["recommendations"] = recommendations if recommendations else ["Site is well-configured!"]
        
    except requests.exceptions.Timeout:
        health_report["status"] = "timeout"
        health_report["message"] = "Server took too long to respond"
        health_report["checks"]["reachability"] = {
            "status": "âœ— Timeout",
            "message": "Server not responding within 10 seconds"
        }
    except requests.exceptions.ConnectionError:
        health_report["status"] = "down"
        health_report["message"] = "Cannot connect to server"
        health_report["checks"]["reachability"] = {
            "status": "âœ— Offline",
            "message": "Server is not reachable"
        }
    except Exception as e:
        health_report["status"] = "error"
        health_report["message"] = str(e)
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(health_report, indent=2)
        }]
    }


@mcp.tool()
def save_to_crm(
    name: str,
    email: str,
    phone: str = "",
    company: str = "",
    interest: str = "",
    budget: str = "",
    source: str = "chatbot"
):
    """
    Save lead to CRM system.
    Integrates with external CRM or saves locally.
    
    Args:
        name: Lead's name
        email: Lead's email
        phone: Phone number (optional)
        company: Company name (optional)
        interest: Area of interest (optional)
        budget: Budget range (optional)
        source: Lead source (default: chatbot)
    
    Returns:
        CRM save status
    """
    crm_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "company": company,
        "interest": interest,
        "budget": budget,
        "source": source,
        "created_at": datetime.now(timezone.utc).isoformat() + "Z",
        "status": "new",
        "lead_score": 0
    }
    
    # Calculate lead score
    score = 0
    if phone: score += 20
    if company: score += 15
    if budget: score += 30
    if interest: score += 20
    if "@" in email and "." in email: score += 15
    
    crm_data["lead_score"] = score
    
    # Classify lead quality
    if score >= 70:
        crm_data["quality"] = "hot"
    elif score >= 50:
        crm_data["quality"] = "warm"
    elif score >= 30:
        crm_data["quality"] = "cold"
    else:
        crm_data["quality"] = "unqualified"
    
    try:
        saved, err = upsert_crm_lead(crm_data)
        if not saved:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "status": "failed",
                        "error": err
                    })
                }]
            }

        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "status": "saved",
                    "lead_score": score,
                    "quality": crm_data["quality"],
                    "message": f"Lead saved successfully with {score}/100 score",
                    "next_action": "Sales team will follow up within 24 hours" if score >= 50 else "Lead added to nurture campaign"
                })
            }]
        }
        
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "status": "failed",
                    "error": str(e)
                })
            }]
        }


@mcp.tool()
def get_analytics_summary(period: str = "30days"):
    """
    Get website analytics summary.
    Shows traffic, conversions, and key metrics.
    
    Args:
        period: Time period - 7days, 30days, 90days, 1year
    
    Returns:
        Analytics summary with traffic and conversion data
    """
    # Simulated analytics (in production, integrate with Google Analytics API)
    analytics_data = {
        "7days": {
            "visitors": 1250,
            "pageviews": 3800,
            "leads": 15,
            "conversion_rate": 1.2,
            "top_pages": [
                {"page": "/services", "views": 850},
                {"page": "/portfolio", "views": 620},
                {"page": "/contact", "views": 480}
            ],
            "traffic_sources": {
                "organic": 45,
                "direct": 30,
                "social": 15,
                "referral": 10
            }
        },
        "30days": {
            "visitors": 5800,
            "pageviews": 18500,
            "leads": 72,
            "conversion_rate": 1.24,
            "top_pages": [
                {"page": "/services", "views": 4200},
                {"page": "/portfolio", "views": 3100},
                {"page": "/contact", "views": 2400}
            ],
            "traffic_sources": {
                "organic": 48,
                "direct": 28,
                "social": 14,
                "referral": 10
            }
        }
    }
    
    data = analytics_data.get(period, analytics_data["30days"])
    
    summary = {
        "period": period,
        "generated_at": datetime.now(timezone.utc).isoformat() + "Z",
        "metrics": {
            "total_visitors": f"{data['visitors']:,}",
            "total_pageviews": f"{data['pageviews']:,}",
            "leads_generated": data['leads'],
            "conversion_rate": f"{data['conversion_rate']}%",
            "avg_pages_per_visit": round(data['pageviews'] / data['visitors'], 2)
        },
        "top_pages": data['top_pages'],
        "traffic_sources": data['traffic_sources'],
        "insights": [
            f"Traffic increased by 22% compared to previous period",
            f"Conversion rate is {data['conversion_rate']}% (industry avg: 2-3%)",
            f"Organic search is your top traffic source ({data['traffic_sources']['organic']}%)"
        ],
        "recommendations": [
            "Focus on SEO to increase organic traffic",
            "Optimize /services page for better conversions",
            "Add more CTAs on high-traffic pages"
        ]
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(summary, indent=2)
        }]
    }

# ============================================================================
# ADVANCED STRATEGIC TOOLS - Phase 2
# ============================================================================

@mcp.tool()
def requirement_scanner(raw_message: str):
    """
    Scan client message and extract structured requirements.
    Converts raw inquiry into actionable project specs.
    
    Args:
        raw_message: Client's raw message/inquiry
    
    Returns:
        Structured requirements with features, complexity, and recommendations
    """
    # Use AI to analyze requirements
    if not client:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "AI not configured",
                    "message": "Requirement scanning requires AI model"
                })
            }]
        }
    
    analysis_prompt = f"""Analyze this client inquiry and extract structured requirements:

"{raw_message}"

Return a JSON with:
1. feature_list: Array of required features
2. admin_panel_needed: true/false
3. authentication_type: "none", "basic", "social", "enterprise"
4. api_integrations: Array of mentioned integrations
5. complexity: "low", "medium", "high", "enterprise"
6. estimated_timeline: In weeks
7. key_requirements: Array of main requirements
8. technical_recommendations: Array of tech suggestions

Be specific and practical."""

    try:
        if client_type == "groq":
            response = groq_client.chat.completions.create(
                model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                messages=[{"role": "user", "content": analysis_prompt}],
                temperature=0.2,
                max_tokens=800
            )
            analysis = response.choices[0].message.content
        elif client_type == "gemini":
            response = gemini_client.generate_content(analysis_prompt)
            analysis = response.text
        else:
            response = openai_client.chat.completions.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[{"role": "user", "content": analysis_prompt}],
                temperature=0.2
            )
            analysis = response.choices[0].message.content
        
        # Try to parse as JSON
        try:
            parsed = json.loads(analysis)
        except:
            # If not JSON, wrap in structure
            parsed = {
                "raw_analysis": analysis,
                "complexity": "medium",
                "message": "AI analysis completed"
            }
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(parsed, indent=2)
            }]
        }
        
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "Analysis failed",
                    "message": str(e)
                })
            }]
        }


@mcp.tool()
def tech_stack_recommender(business_type: str, requirements: str = "", scale: str = "medium"):
    """
    Recommend optimal tech stack based on business type and requirements.
    Builds authority by showing technical expertise.
    
    Args:
        business_type: Type of business (e.g., "saas", "ecommerce", "local_business")
        requirements: Additional requirements
        scale: Expected scale - "small", "medium", "large", "enterprise"
    
    Returns:
        Recommended tech stack with justification
    """
    # Predefined tech stacks
    stacks = {
        "saas": {
            "frontend": "Next.js (React)",
            "backend": "Node.js + Express",
            "database": "PostgreSQL",
            "auth": "NextAuth.js",
            "hosting": "Vercel + AWS RDS",
            "payment": "Stripe",
            "justification": "Scalable, SEO-friendly, fast development"
        },
        "ecommerce": {
            "frontend": "Next.js + Tailwind CSS",
            "backend": "Node.js + Express",
            "database": "MongoDB",
            "auth": "JWT + OAuth",
            "hosting": "AWS / Vercel",
            "payment": "Razorpay + Stripe",
            "justification": "Fast, scalable, handles high traffic"
        },
        "local_business": {
            "frontend": "React + Vite",
            "backend": "Node.js (optional)",
            "database": "Firebase / Supabase",
            "auth": "Firebase Auth",
            "hosting": "Netlify / Vercel",
            "payment": "Razorpay",
            "justification": "Cost-effective, easy maintenance, fast deployment"
        },
        "portfolio": {
            "frontend": "Next.js + Framer Motion",
            "backend": "Static / Headless CMS",
            "database": "Not required",
            "auth": "Not required",
            "hosting": "Vercel / Netlify",
            "payment": "Not required",
            "justification": "Lightning fast, SEO optimized, minimal cost"
        },
        "blog": {
            "frontend": "Next.js + MDX",
            "backend": "Headless CMS (Sanity/Contentful)",
            "database": "CMS managed",
            "auth": "Optional",
            "hosting": "Vercel",
            "payment": "Optional",
            "justification": "SEO-first, content-focused, easy updates"
        },
        "marketplace": {
            "frontend": "Next.js",
            "backend": "Node.js + GraphQL",
            "database": "PostgreSQL + Redis",
            "auth": "Multi-role authentication",
            "hosting": "AWS / GCP",
            "payment": "Stripe Connect / Razorpay",
            "justification": "Handles complex transactions, scalable, secure"
        }
    }
    
    # Find matching stack
    business_key = business_type.lower().replace(" ", "_")
    stack = stacks.get(business_key, stacks["local_business"])
    
    # Scale adjustments
    if scale == "enterprise":
        stack["additional"] = {
            "load_balancer": "AWS ELB",
            "cdn": "CloudFront",
            "monitoring": "DataDog / New Relic",
            "ci_cd": "GitHub Actions + Docker"
        }
    
    recommendation = {
        "business_type": business_type,
        "scale": scale,
        "recommended_stack": stack,
        "estimated_cost": {
            "small": "â‚¹50,000 - â‚¹1,00,000",
            "medium": "â‚¹1,00,000 - â‚¹3,00,000",
            "large": "â‚¹3,00,000 - â‚¹8,00,000",
            "enterprise": "â‚¹8,00,000+"
        }.get(scale, "â‚¹1,00,000 - â‚¹3,00,000"),
        "development_time": {
            "small": "4-6 weeks",
            "medium": "8-12 weeks",
            "large": "12-20 weeks",
            "enterprise": "20+ weeks"
        }.get(scale, "8-12 weeks"),
        "why_this_stack": stack["justification"],
        "alternatives": "We can customize based on your specific needs"
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(recommendation, indent=2)
        }]
    }


@mcp.tool()
def ecommerce_cost_estimator(
    products_count: str = "100",
    payment_gateway: str = "yes",
    inventory_system: str = "yes",
    multi_vendor: str = "no",
    shipping_api: str = "yes",
    gst_support: str = "yes"
):
    """
    Detailed e-commerce cost breakdown calculator.
    More accurate than generic pricing.
    
    Args:
        products_count: Number of products (e.g., "100", "1000", "10000+")
        payment_gateway: Include payment gateway? (yes/no)
        inventory_system: Include inventory management? (yes/no)
        multi_vendor: Multi-vendor marketplace? (yes/no)
        shipping_api: Shipping API integration? (yes/no)
        gst_support: GST/Tax calculation? (yes/no)
    
    Returns:
        Detailed e-commerce cost breakdown
    """
    base_cost = 75000  # Base e-commerce platform
    
    breakdown = {
        "base_platform": base_cost,
        "features": {}
    }
    
    # Calculate based on product count
    if "10000" in products_count or "+" in products_count:
        breakdown["features"]["large_catalog"] = 25000
    elif "1000" in products_count:
        breakdown["features"]["medium_catalog"] = 15000
    else:
        breakdown["features"]["small_catalog"] = 0
    
    # Payment gateway
    if payment_gateway.lower() == "yes":
        breakdown["features"]["payment_gateway"] = 12000
    
    # Inventory system
    if inventory_system.lower() == "yes":
        breakdown["features"]["inventory_management"] = 18000
    
    # Multi-vendor
    if multi_vendor.lower() == "yes":
        breakdown["features"]["multi_vendor_system"] = 50000
    
    # Shipping API
    if shipping_api.lower() == "yes":
        breakdown["features"]["shipping_integration"] = 10000
    
    # GST support
    if gst_support.lower() == "yes":
        breakdown["features"]["gst_tax_system"] = 8000
    
    # Calculate total
    total = base_cost + sum(breakdown["features"].values())
    
    # Bundle discount
    if len(breakdown["features"]) >= 4:
        discount = int(total * 0.12)
        final_price = total - discount
    else:
        discount = 0
        final_price = total
    
    result = {
        "breakdown": breakdown,
        "subtotal": f"â‚¹{total:,}",
        "bundle_discount": f"â‚¹{discount:,}" if discount > 0 else "â‚¹0",
        "final_price": f"â‚¹{final_price:,}",
        "estimated_timeline": "10-16 weeks",
        "includes": [
            "Admin dashboard",
            "Customer portal",
            "Order management",
            "Product catalog",
            "Search & filters",
            "Mobile responsive",
            "3 months support"
        ],
        "optional_addons": {
            "mobile_app": "â‚¹1,50,000",
            "advanced_analytics": "â‚¹25,000",
            "email_marketing": "â‚¹15,000",
            "loyalty_program": "â‚¹20,000"
        }
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(result, indent=2)
        }]
    }


@mcp.tool()
def ui_wireframe_generator(business_type: str, pages: str = ""):
    """
    Generate UI wireframe suggestions and page structure.
    Helps client visualize the project.
    
    Args:
        business_type: Type of business
        pages: Comma-separated page list (optional)
    
    Returns:
        Page structure and layout recommendations
    """
    # Common page structures
    structures = {
        "restaurant": {
            "pages": ["Home", "Menu", "About", "Contact", "Order Online", "Reservations"],
            "home_sections": [
                "Hero with food image",
                "Featured dishes",
                "About us",
                "Menu highlights",
                "Customer reviews",
                "Location & hours",
                "CTA (Order/Reserve)"
            ],
            "key_features": [
                "Online ordering system",
                "Table reservation",
                "Menu with images",
                "Location map",
                "Contact form"
            ]
        },
        "ecommerce": {
            "pages": ["Home", "Shop", "Product Details", "Cart", "Checkout", "Account", "About"],
            "home_sections": [
                "Hero banner with offers",
                "Featured products",
                "Categories grid",
                "Best sellers",
                "Testimonials",
                "Newsletter signup"
            ],
            "key_features": [
                "Product search & filters",
                "Shopping cart",
                "Wishlist",
                "User accounts",
                "Payment gateway",
                "Order tracking"
            ]
        },
        "saas": {
            "pages": ["Home", "Features", "Pricing", "About", "Blog", "Contact", "Dashboard"],
            "home_sections": [
                "Hero with value proposition",
                "Key features showcase",
                "How it works",
                "Pricing plans",
                "Customer testimonials",
                "CTA (Start free trial)"
            ],
            "key_features": [
                "User authentication",
                "Dashboard",
                "Analytics",
                "API access",
                "Team collaboration",
                "Billing system"
            ]
        },
        "portfolio": {
            "pages": ["Home", "Portfolio", "About", "Services", "Contact"],
            "home_sections": [
                "Hero with introduction",
                "Featured work",
                "Skills & expertise",
                "Client testimonials",
                "Contact CTA"
            ],
            "key_features": [
                "Project showcase",
                "Image gallery",
                "Contact form",
                "Social links",
                "Blog (optional)"
            ]
        }
    }
    
    business_key = business_type.lower().replace(" ", "_")
    structure = structures.get(business_key, structures["portfolio"])
    
    wireframe = {
        "business_type": business_type,
        "recommended_pages": structure["pages"],
        "home_page_structure": structure["home_sections"],
        "key_features": structure["key_features"],
        "design_recommendations": [
            "Mobile-first responsive design",
            "Fast loading (< 3 seconds)",
            "Clear call-to-actions",
            "Consistent branding",
            "Accessible (WCAG compliant)"
        ],
        "ux_improvements": [
            "Simple navigation",
            "Clear hierarchy",
            "White space for readability",
            "Visual feedback on interactions",
            "Easy-to-find contact info"
        ],
        "next_step": "We can create detailed wireframes and mockups for your review"
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(wireframe, indent=2)
        }]
    }


@mcp.tool()
def seo_growth_plan(domain: str = "", target_keywords: str = "", timeline: str = "3 months"):
    """
    Generate comprehensive SEO growth plan with roadmap.
    Upgrades basic seo_audit to actionable strategy.
    
    Args:
        domain: Website domain (optional)
        target_keywords: Target keywords (optional)
        timeline: Plan duration (default: 3 months)
    
    Returns:
        Detailed SEO growth plan with monthly roadmap
    """
    plan = {
        "timeline": timeline,
        "domain": domain if domain else "Your website",
        "target_keywords": target_keywords if target_keywords else "To be determined",
        
        "month_1": {
            "focus": "Technical SEO Foundation",
            "tasks": [
                "Fix technical SEO issues",
                "Optimize site speed (target < 3s)",
                "Implement schema markup",
                "Fix broken links",
                "Optimize images (WebP format)",
                "Setup Google Search Console",
                "Setup Google Analytics 4",
                "Create XML sitemap",
                "Optimize robots.txt"
            ],
            "expected_result": "Clean technical foundation"
        },
        
        "month_2": {
            "focus": "On-Page SEO & Content",
            "tasks": [
                "Keyword research & clustering",
                "Optimize meta titles & descriptions",
                "Optimize H1-H6 tags",
                "Internal linking strategy",
                "Create 8-10 SEO-optimized blog posts",
                "Optimize existing content",
                "Add alt text to all images",
                "Improve content readability"
            ],
            "expected_result": "20-30% increase in organic traffic"
        },
        
        "month_3": {
            "focus": "Off-Page SEO & Authority Building",
            "tasks": [
                "Build 15-20 quality backlinks",
                "Guest posting on relevant sites",
                "Local SEO optimization (if applicable)",
                "Social media integration",
                "Create shareable content",
                "Monitor & respond to reviews",
                "Competitor analysis",
                "Performance tracking & reporting"
            ],
            "expected_result": "40-60% increase in organic traffic"
        },
        
        "keyword_strategy": {
            "primary_keywords": "3-5 high-value keywords",
            "secondary_keywords": "10-15 supporting keywords",
            "long_tail_keywords": "20-30 specific phrases",
            "approach": "Target low-competition, high-intent keywords first"
        },
        
        "content_plan": {
            "blog_posts": "12-15 SEO-optimized articles",
            "page_optimization": "All main pages",
            "content_types": [
                "How-to guides",
                "Industry insights",
                "Case studies",
                "FAQs",
                "Comparison articles"
            ]
        },
        
        "technical_priorities": [
            "1. Page speed optimization (High Priority)",
            "2. Mobile optimization (High Priority)",
            "3. Schema markup (Medium Priority)",
            "4. Security (HTTPS) (High Priority)",
            "5. Core Web Vitals (High Priority)"
        ],
        
        "expected_outcomes": {
            "month_1": "Technical foundation complete",
            "month_2": "20-30% traffic increase",
            "month_3": "40-60% traffic increase",
            "month_6": "100-150% traffic increase (with continued effort)"
        },
        
        "investment": {
            "basic_plan": "â‚¹15,000/month",
            "advanced_plan": "â‚¹35,000/month",
            "enterprise_plan": "â‚¹75,000/month"
        },
        
        "includes": [
            "Monthly SEO audit",
            "Keyword research",
            "Content optimization",
            "Technical fixes",
            "Backlink building",
            "Monthly reports",
            "Strategy adjustments"
        ]
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(plan, indent=2)
        }]
    }


@mcp.tool()
def competitor_analysis(your_domain: str, competitor_domain: str):
    """
    Analyze competitor website and identify opportunities.
    High-value feature for strategic planning.
    
    Args:
        your_domain: Client's domain
        competitor_domain: Competitor's domain to analyze
    
    Returns:
        Competitive analysis with gaps and opportunities
    """
    # Simulated analysis (in production, use real SEO APIs)
    analysis = {
        "your_domain": your_domain,
        "competitor_domain": competitor_domain,
        "analyzed_at": datetime.now(timezone.utc).isoformat() + "Z",
        
        "traffic_comparison": {
            "competitor_estimated_traffic": "15,000 monthly visitors",
            "your_estimated_traffic": "5,000 monthly visitors",
            "gap": "10,000 visitors (3x difference)",
            "opportunity": "Significant growth potential"
        },
        
        "keyword_gaps": {
            "competitor_ranking_for": [
                "web development services (Position 3)",
                "custom website design (Position 5)",
                "ecommerce solutions (Position 7)"
            ],
            "you_missing": [
                "web development services",
                "custom website design"
            ],
            "quick_wins": [
                "Target 'affordable web development' (low competition)",
                "Target 'local web design services' (high intent)",
                "Create comparison content"
            ]
        },
        
        "content_strategy_difference": {
            "competitor_strengths": [
                "Regular blog updates (2-3 posts/week)",
                "Case studies showcase",
                "Video content",
                "Detailed service pages"
            ],
            "your_opportunities": [
                "Create more blog content",
                "Add case studies",
                "Improve service page depth",
                "Add client testimonials"
            ]
        },
        
        "technical_comparison": {
            "competitor": {
                "page_speed": "2.1s (Good)",
                "mobile_score": "92/100",
                "seo_score": "85/100"
            },
            "you": {
                "page_speed": "3.5s (Needs improvement)",
                "mobile_score": "78/100",
                "seo_score": "72/100"
            },
            "priority_fixes": [
                "Improve page speed to < 2.5s",
                "Optimize mobile experience",
                "Add missing meta descriptions"
            ]
        },
        
        "backlink_analysis": {
            "competitor_backlinks": "~250 quality backlinks",
            "your_backlinks": "~80 backlinks",
            "gap": "170 backlinks needed",
            "strategy": "Focus on guest posting and industry directories"
        },
        
        "actionable_recommendations": [
            "1. Target competitor's keyword gaps (Quick win)",
            "2. Improve page speed to match competitor",
            "3. Create 2-3 blog posts per week",
            "4. Build 20-30 quality backlinks",
            "5. Add case studies and testimonials",
            "6. Optimize for mobile (score 90+)",
            "7. Create comparison content (Your service vs Competitor)"
        ],
        
        "estimated_timeline": "3-6 months to close the gap",
        "investment_needed": "â‚¹35,000-50,000/month for aggressive growth"
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(analysis, indent=2)
        }]
    }


# ============================================================================
# PHASE 3: REVENUE AUTOMATION & CLIENT DASHBOARD
# ============================================================================

@mcp.tool()
def payment_link_generator(
    client_name: str,
    amount: str,
    description: str = "",
    payment_type: str = "advance"
):
    """
    Generate payment link for client invoices.
    Automates payment collection process.
    
    Args:
        client_name: Client's name
        amount: Amount in rupees (e.g., "50000")
        description: Payment description
        payment_type: "advance", "milestone", "final"
    
    Returns:
        Payment link details and instructions
    """
    # Parse amount
    try:
        amount_value = int(amount.replace(",", "").replace("â‚¹", "").strip())
    except:
        amount_value = 0
    
    # Generate unique payment ID
    payment_id = f"PAY_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    payment_data = {
        "payment_id": payment_id,
        "client_name": client_name,
        "amount": f"â‚¹{amount_value:,}",
        "amount_value": amount_value,
        "description": description if description else f"{payment_type.title()} payment",
        "payment_type": payment_type,
        "created_at": datetime.now(timezone.utc).isoformat() + "Z",
        "status": "pending",
        
        "payment_methods": {
            "razorpay": {
                "available": True,
                "link": f"https://razorpay.com/payment/{payment_id}",
                "instructions": "Click link to pay via UPI, Card, NetBanking"
            },
            "bank_transfer": {
                "available": True,
                "account_name": "CodeSunny Solutions",
                "account_number": "XXXX-XXXX-XXXX",
                "ifsc": "XXXX0000XXX",
                "bank": "HDFC Bank"
            },
            "upi": {
                "available": True,
                "upi_id": "codesunny@paytm",
                "qr_code": "Available on request"
            }
        },
        
        "payment_terms": {
            "advance": "30% of total project cost",
            "milestone": "40% on milestone completion",
            "final": "30% on project delivery"
        }.get(payment_type, "As per agreement"),
        
        "validity": "7 days",
        "next_steps": [
            "1. Review payment details",
            "2. Choose payment method",
            "3. Complete payment",
            "4. Share payment confirmation",
            "5. Project work begins"
        ]
    }
    
    # Save payment record
    try:
        payments_file = Path(__file__).parent / "data" / "payments.json"
        
        if payments_file.exists():
            with payments_file.open("r", encoding="utf-8") as f:
                payments = json.load(f)
        else:
            payments = []
        
        payments.append(payment_data)
        
        with payments_file.open("w", encoding="utf-8") as f:
            json.dump(payments, f, indent=2)
    except Exception as e:
        print(f"Payment save error: {e}")
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(payment_data, indent=2)
        }]
    }


@mcp.tool()
def campaign_budget_calculator(
    platform: str,
    target_country: str = "India",
    duration_days: str = "30",
    daily_budget: str = "1000"
):
    """
    Calculate digital marketing campaign budget and expected results.
    Helps clients understand ad spend ROI.
    
    Args:
        platform: "google", "facebook", "instagram", "linkedin", "all"
        target_country: Target country (default: India)
        duration_days: Campaign duration in days
        daily_budget: Daily budget in rupees
    
    Returns:
        Campaign budget breakdown with expected reach and conversions
    """
    try:
        days = int(duration_days)
        budget = int(daily_budget.replace(",", "").replace("â‚¹", "").strip())
    except:
        days = 30
        budget = 1000
    
    total_budget = budget * days
    
    # Platform-specific metrics (India averages)
    platform_data = {
        "google": {
            "cpc": 15,  # Cost per click
            "ctr": 3.5,  # Click-through rate %
            "conversion_rate": 2.5,  # Conversion rate %
            "best_for": "Search intent, High purchase intent"
        },
        "facebook": {
            "cpc": 8,
            "ctr": 2.0,
            "conversion_rate": 1.5,
            "best_for": "Brand awareness, Broad targeting"
        },
        "instagram": {
            "cpc": 10,
            "ctr": 2.5,
            "conversion_rate": 1.8,
            "best_for": "Visual products, Younger audience"
        },
        "linkedin": {
            "cpc": 50,
            "ctr": 1.5,
            "conversion_rate": 3.0,
            "best_for": "B2B, Professional services"
        }
    }
    
    platform_key = platform.lower()
    if platform_key not in platform_data:
        platform_key = "google"
    
    metrics = platform_data[platform_key]
    
    # Calculate expected results
    estimated_clicks = int(total_budget / metrics["cpc"])
    estimated_impressions = int(estimated_clicks / (metrics["ctr"] / 100))
    estimated_conversions = int(estimated_clicks * (metrics["conversion_rate"] / 100))
    cost_per_conversion = int(total_budget / estimated_conversions) if estimated_conversions > 0 else 0
    
    campaign = {
        "platform": platform.title(),
        "target_country": target_country,
        "duration": f"{days} days",
        "daily_budget": f"â‚¹{budget:,}",
        "total_budget": f"â‚¹{total_budget:,}",
        
        "expected_results": {
            "impressions": f"{estimated_impressions:,}",
            "clicks": f"{estimated_clicks:,}",
            "conversions": estimated_conversions,
            "ctr": f"{metrics['ctr']}%",
            "conversion_rate": f"{metrics['conversion_rate']}%",
            "cost_per_click": f"â‚¹{metrics['cpc']}",
            "cost_per_conversion": f"â‚¹{cost_per_conversion:,}"
        },
        
        "best_for": metrics["best_for"],
        
        "recommended_strategy": {
            "week_1": "Testing phase - Multiple ad variations",
            "week_2": "Optimization - Focus on best performers",
            "week_3": "Scaling - Increase budget on winners",
            "week_4": "Refinement - Fine-tune targeting"
        },
        
        "budget_allocation": {
            "ad_spend": f"â‚¹{int(total_budget * 0.85):,} (85%)",
            "creative_design": f"â‚¹{int(total_budget * 0.10):,} (10%)",
            "management_fee": f"â‚¹{int(total_budget * 0.05):,} (5%)"
        },
        
        "success_metrics": [
            f"Target: {estimated_conversions} conversions",
            f"Cost per conversion: â‚¹{cost_per_conversion:,}",
            f"Expected ROI: 200-300% (if avg order value > â‚¹{cost_per_conversion * 3:,})"
        ],
        
        "our_service": {
            "setup_fee": "â‚¹15,000 (one-time)",
            "management_fee": "15% of ad spend or â‚¹10,000/month (whichever is higher)",
            "includes": [
                "Campaign strategy",
                "Ad creative design",
                "Daily monitoring",
                "Weekly reports",
                "A/B testing",
                "Optimization"
            ]
        }
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(campaign, indent=2)
        }]
    }


@mcp.tool()
def social_content_plan(business_type: str, duration: str = "30 days"):
    """
    Generate social media content calendar.
    Provides 30-day content plan with post ideas.
    
    Args:
        business_type: Type of business
        duration: Plan duration (default: 30 days)
    
    Returns:
        30-day content calendar with post ideas, captions, hashtags
    """
    # Content themes by business type
    content_themes = {
        "restaurant": {
            "themes": [
                "Food photography",
                "Behind the scenes",
                "Chef specials",
                "Customer reviews",
                "Recipe tips",
                "Special offers"
            ],
            "hashtags": "#FoodLover #Restaurant #FoodPhotography #Delicious #FoodBlogger"
        },
        "ecommerce": {
            "themes": [
                "Product showcase",
                "Customer testimonials",
                "How-to guides",
                "Flash sales",
                "New arrivals",
                "User-generated content"
            ],
            "hashtags": "#Shopping #OnlineShopping #Fashion #Deals #NewArrivals"
        },
        "saas": {
            "themes": [
                "Product features",
                "Customer success stories",
                "Industry insights",
                "Tips & tricks",
                "Webinar announcements",
                "Team culture"
            ],
            "hashtags": "#SaaS #Technology #Productivity #Business #Innovation"
        },
        "agency": {
            "themes": [
                "Portfolio showcase",
                "Client testimonials",
                "Industry trends",
                "Case studies",
                "Team expertise",
                "Free resources"
            ],
            "hashtags": "#WebDevelopment #DigitalMarketing #WebDesign #Agency #Business"
        }
    }
    
    business_key = business_type.lower().replace(" ", "_")
    themes = content_themes.get(business_key, content_themes["agency"])
    
    # Generate 30-day plan
    weekly_plan = {
        "week_1": {
            "focus": "Brand Introduction",
            "posts": [
                {
                    "day": "Monday",
                    "type": "Image Post",
                    "theme": themes["themes"][0],
                    "caption_idea": "Introduce your brand story",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Wednesday",
                    "type": "Carousel",
                    "theme": themes["themes"][1],
                    "caption_idea": "Show behind the scenes",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Friday",
                    "type": "Reel",
                    "theme": themes["themes"][2],
                    "caption_idea": "Quick tip or showcase",
                    "hashtags": themes["hashtags"]
                }
            ]
        },
        "week_2": {
            "focus": "Value & Education",
            "posts": [
                {
                    "day": "Monday",
                    "type": "Educational Post",
                    "theme": themes["themes"][3],
                    "caption_idea": "Share industry insights",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Wednesday",
                    "type": "Customer Story",
                    "theme": themes["themes"][4],
                    "caption_idea": "Feature customer testimonial",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Friday",
                    "type": "Reel",
                    "theme": themes["themes"][5],
                    "caption_idea": "Quick tutorial or demo",
                    "hashtags": themes["hashtags"]
                }
            ]
        },
        "week_3": {
            "focus": "Engagement & Community",
            "posts": [
                {
                    "day": "Monday",
                    "type": "Poll/Question",
                    "theme": "Community engagement",
                    "caption_idea": "Ask audience opinion",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Wednesday",
                    "type": "User Generated Content",
                    "theme": "Customer spotlight",
                    "caption_idea": "Share customer content",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Friday",
                    "type": "Reel",
                    "theme": "Trending audio",
                    "caption_idea": "Jump on trending topic",
                    "hashtags": themes["hashtags"]
                }
            ]
        },
        "week_4": {
            "focus": "Promotion & CTA",
            "posts": [
                {
                    "day": "Monday",
                    "type": "Offer Announcement",
                    "theme": themes["themes"][0],
                    "caption_idea": "Special offer or discount",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Wednesday",
                    "type": "Case Study",
                    "theme": "Success story",
                    "caption_idea": "Show results/transformation",
                    "hashtags": themes["hashtags"]
                },
                {
                    "day": "Friday",
                    "type": "Reel",
                    "theme": "Call to action",
                    "caption_idea": "Strong CTA to convert",
                    "hashtags": themes["hashtags"]
                }
            ]
        }
    }
    
    content_plan = {
        "business_type": business_type,
        "duration": duration,
        "posting_frequency": "3 posts per week (Mon, Wed, Fri)",
        "total_posts": 12,
        
        "content_calendar": weekly_plan,
        
        "content_mix": {
            "educational": "30%",
            "promotional": "20%",
            "engagement": "30%",
            "entertainment": "20%"
        },
        
        "best_posting_times": {
            "instagram": "11 AM - 1 PM, 7 PM - 9 PM",
            "facebook": "1 PM - 3 PM",
            "linkedin": "8 AM - 10 AM, 5 PM - 6 PM"
        },
        
        "content_creation_tips": [
            "Use high-quality images (1080x1080 for posts)",
            "Keep captions concise (125-150 characters)",
            "Use 5-10 relevant hashtags",
            "Include clear call-to-action",
            "Respond to comments within 1 hour",
            "Post consistently at same times"
        ],
        
        "our_service": {
            "content_creation": "â‚¹15,000/month",
            "includes": [
                "12 custom posts per month",
                "Caption writing",
                "Hashtag research",
                "Posting schedule",
                "Basic graphics design",
                "Monthly analytics report"
            ],
            "premium_package": {
                "price": "â‚¹35,000/month",
                "includes": [
                    "20 posts + 8 reels per month",
                    "Professional photography",
                    "Video editing",
                    "Story management",
                    "Community management",
                    "Paid ads management"
                ]
            }
        }
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(content_plan, indent=2)
        }]
    }


@mcp.tool()
def hosting_recommendation(
    traffic: str,
    application_type: str = "website",
    database_size: str = "small"
):
    """
    Recommend hosting solution based on requirements.
    Helps clients choose right hosting plan.
    
    Args:
        traffic: Expected traffic (e.g., "10000", "high", "medium", "low")
        application_type: "website", "webapp", "ecommerce", "saas"
        database_size: "small", "medium", "large"
    
    Returns:
        Hosting recommendation with specs and pricing
    """
    # Determine traffic tier
    if "high" in traffic.lower() or "100000" in traffic or "lakh" in traffic.lower():
        tier = "enterprise"
    elif "medium" in traffic.lower() or "50000" in traffic:
        tier = "business"
    elif "low" in traffic.lower() or "10000" in traffic:
        tier = "startup"
    else:
        # Try to parse number
        try:
            num = int(traffic.replace(",", ""))
            if num > 50000:
                tier = "enterprise"
            elif num > 10000:
                tier = "business"
            else:
                tier = "startup"
        except:
            tier = "startup"
    
    # Hosting recommendations
    recommendations = {
        "startup": {
            "name": "Shared/VPS Hosting",
            "provider": "Hostinger / Bluehost",
            "specs": {
                "cpu": "2 vCPU",
                "ram": "2GB",
                "storage": "50GB SSD",
                "bandwidth": "Unlimited"
            },
            "monthly_cost": 500,
            "setup_cost": 0,
            "suitable_for": "Up to 10,000 monthly visitors",
            "pros": [
                "Very affordable",
                "Easy to manage",
                "Good for beginners"
            ],
            "cons": [
                "Limited scalability",
                "Shared resources"
            ]
        },
        "business": {
            "name": "Cloud VPS",
            "provider": "DigitalOcean / AWS Lightsail",
            "specs": {
                "cpu": "4 vCPU",
                "ram": "8GB",
                "storage": "160GB SSD",
                "bandwidth": "5TB"
            },
            "monthly_cost": 3000,
            "setup_cost": 5000,
            "suitable_for": "10,000 - 50,000 monthly visitors",
            "pros": [
                "Scalable",
                "Good performance",
                "Full control"
            ],
            "cons": [
                "Requires technical knowledge",
                "Self-managed"
            ]
        },
        "enterprise": {
            "name": "Managed Cloud",
            "provider": "AWS / Google Cloud / Azure",
            "specs": {
                "cpu": "8 vCPU (Auto-scaling)",
                "ram": "16GB+",
                "storage": "500GB SSD",
                "bandwidth": "Unlimited",
                "extras": "Load balancer, CDN, Auto-scaling"
            },
            "monthly_cost": 15000,
            "setup_cost": 25000,
            "suitable_for": "50,000+ monthly visitors",
            "pros": [
                "Highly scalable",
                "99.99% uptime",
                "Enterprise support",
                "Auto-scaling"
            ],
            "cons": [
                "Higher cost",
                "Complex setup"
            ]
        }
    }
    
    selected = recommendations[tier]
    
    # Application-specific adjustments
    if application_type.lower() == "saas":
        selected["additional_requirements"] = {
            "database": "Managed PostgreSQL/MySQL",
            "cache": "Redis/Memcached",
            "queue": "RabbitMQ/SQS",
            "monitoring": "DataDog/New Relic"
        }
    elif application_type.lower() == "ecommerce":
        selected["additional_requirements"] = {
            "ssl": "Premium SSL certificate",
            "cdn": "CloudFlare/CloudFront",
            "backup": "Daily automated backups",
            "security": "WAF + DDoS protection"
        }
    
    recommendation = {
        "traffic_tier": tier,
        "application_type": application_type,
        "recommended_solution": selected,
        
        "total_first_year_cost": f"â‚¹{(selected['monthly_cost'] * 12) + selected['setup_cost']:,}",
        "monthly_recurring": f"â‚¹{selected['monthly_cost']:,}",
        
        "our_services": {
            "setup_deployment": {
                "price": "â‚¹20,000",
                "includes": [
                    "Server setup & configuration",
                    "Application deployment",
                    "SSL certificate setup",
                    "Domain configuration",
                    "Security hardening",
                    "Backup configuration"
                ]
            },
            "managed_hosting": {
                "price": f"â‚¹{selected['monthly_cost'] + 5000:,}/month",
                "includes": [
                    "24/7 monitoring",
                    "Security updates",
                    "Performance optimization",
                    "Daily backups",
                    "Technical support",
                    "Uptime guarantee"
                ]
            }
        },
        
        "migration_service": {
            "available": True,
            "price": "â‚¹15,000",
            "includes": [
                "Data migration",
                "Zero downtime migration",
                "DNS management",
                "Post-migration testing"
            ]
        }
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(recommendation, indent=2)
        }]
    }


@mcp.tool()
def crm_pipeline_manager(action: str, lead_id: str = "", stage: str = ""):
    """
    Manage CRM pipeline and lead stages.
    Track leads through sales funnel.
    
    Args:
        action: "view", "update_stage", "get_stats"
        lead_id: Lead ID (for update_stage)
        stage: New stage (for update_stage): "new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"
    
    Returns:
        Pipeline status or update confirmation
    """
    try:
        leads, err = load_crm_leads()
        if err:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": err,
                        "message": "CRM storage is unavailable. Configure MongoDB."
                    })
                }]
            }

        if not leads:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": "No CRM data found",
                        "message": "No leads in CRM yet"
                    })
                }]
            }
        
        if action == "view":
            # Group leads by stage
            pipeline = {
                "new": [],
                "contacted": [],
                "qualified": [],
                "proposal": [],
                "negotiation": [],
                "won": [],
                "lost": []
            }
            
            for lead in leads:
                stage_key = lead.get("status", "new")
                if stage_key in pipeline:
                    pipeline[stage_key].append({
                        "name": lead.get("name"),
                        "email": lead.get("email"),
                        "lead_score": lead.get("lead_score", 0),
                        "created_at": lead.get("created_at")
                    })
            
            stats = {
                "total_leads": len(leads),
                "by_stage": {k: len(v) for k, v in pipeline.items()},
                "conversion_rate": f"{(len(pipeline['won']) / len(leads) * 100):.1f}%" if leads else "0%"
            }
            
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "pipeline": pipeline,
                        "stats": stats
                    }, indent=2)
                }]
            }
        
        elif action == "get_stats":
            # Calculate pipeline statistics
            total = len(leads)
            hot_leads = sum(1 for l in leads if l.get("quality") == "hot")
            warm_leads = sum(1 for l in leads if l.get("quality") == "warm")
            cold_leads = sum(1 for l in leads if l.get("quality") == "cold")
            
            avg_score = sum(l.get("lead_score", 0) for l in leads) / total if total > 0 else 0
            
            stats = {
                "total_leads": total,
                "hot_leads": hot_leads,
                "warm_leads": warm_leads,
                "cold_leads": cold_leads,
                "average_lead_score": f"{avg_score:.1f}",
                "quality_distribution": {
                    "hot": f"{(hot_leads/total*100):.1f}%" if total > 0 else "0%",
                    "warm": f"{(warm_leads/total*100):.1f}%" if total > 0 else "0%",
                    "cold": f"{(cold_leads/total*100):.1f}%" if total > 0 else "0%"
                }
            }
            
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps(stats, indent=2)
                }]
            }
        
        else:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": "Invalid action",
                        "valid_actions": ["view", "update_stage", "get_stats"]
                    })
                }]
            }
            
    except Exception as e:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "Pipeline management failed",
                    "message": str(e)
                })
            }]
        }


@mcp.tool()
def client_dashboard_summary(client_email: str):
    """
    Generate client dashboard summary.
    Shows project progress, pending items, next milestones.
    
    Args:
        client_email: Client's email address
    
    Returns:
        Dashboard summary with project status and updates
    """
    # Simulated dashboard (in production, fetch from database)
    dashboard = {
        "client_email": client_email,
        "generated_at": datetime.now(timezone.utc).isoformat() + "Z",
        
        "active_projects": [
            {
                "project_name": "E-commerce Website",
                "status": "in_progress",
                "progress": 65,
                "current_phase": "Backend Development",
                "next_milestone": "API Integration",
                "estimated_completion": "2026-03-15",
                "team_assigned": ["Developer A", "Designer B"]
            }
        ],
        
        "pending_items": [
            {
                "item": "Logo files needed",
                "priority": "high",
                "due_date": "2026-02-20"
            },
            {
                "item": "Content for About page",
                "priority": "medium",
                "due_date": "2026-02-25"
            }
        ],
        
        "recent_updates": [
            {
                "date": "2026-02-15",
                "update": "Homepage design approved",
                "type": "milestone"
            },
            {
                "date": "2026-02-10",
                "update": "Database schema finalized",
                "type": "progress"
            }
        ],
        
        "upcoming_milestones": [
            {
                "milestone": "API Integration Complete",
                "date": "2026-02-28",
                "status": "on_track"
            },
            {
                "milestone": "Admin Panel Ready",
                "date": "2026-03-10",
                "status": "on_track"
            }
        ],
        
        "invoices": [
            {
                "invoice_id": "INV-001",
                "amount": "â‚¹50,000",
                "status": "paid",
                "date": "2026-01-15"
            },
            {
                "invoice_id": "INV-002",
                "amount": "â‚¹40,000",
                "status": "pending",
                "due_date": "2026-02-28"
            }
        ],
        
        "support_tickets": {
            "open": 1,
            "resolved": 5,
            "average_response_time": "2 hours"
        },
        
        "quick_actions": [
            "View project files",
            "Schedule meeting",
            "Submit feedback",
            "Request changes",
            "View invoices"
        ]
    }
    
    return {
        "content": [{
            "type": "text",
            "text": json.dumps(dashboard, indent=2)
        }]
    }


# ============================================================================
# PHASE 3: REVENUE AUTOMATION LAYER - CRITICAL TOOLS
# ============================================================================

def check_rate_limit(user_id: str = "default") -> bool:
    """Check if user has exceeded rate limit"""
    now = time.time()
    user_requests = rate_limit_store[user_id]
    
    # Remove old requests outside window
    user_requests = [req_time for req_time in user_requests if now - req_time < RATE_LIMIT_WINDOW]
    rate_limit_store[user_id] = user_requests
    
    if len(user_requests) >= RATE_LIMIT_MAX_REQUESTS:
        return False
    
    # Add current request
    rate_limit_store[user_id].append(now)
    return True


def log_tool_usage(tool_name: str, status: str, error: str = ""):
    """Log tool usage for monitoring"""
    log_entry = {
        "tool": tool_name,
        "status": status,
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
        "error": error
    }
    
    # Log to file
    log_file = Path(__file__).parent / "data" / "tool_usage.log"
    with log_file.open("a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")

    if structured_log_tool_execution:
        try:
            structured_log_tool_execution(
                tool_name=tool_name,
                status=status,
                execution_time=0.0,
                error=error,
            )
        except Exception:
            pass


@mcp.tool()
def generate_proposal_pdf(
    client_name: str,
    client_email: str,
    services: str,
    total_amount: str,
    timeline: str = "8-12 weeks",
    send_email: bool = True
):
    """
    Generate professional PDF proposal and optionally email it.
    CRITICAL for revenue automation - converts quotes to actionable proposals.
    
    Args:
        client_name: Client's name or company
        client_email: Client's email address
        services: Comma-separated services
        total_amount: Total project amount (e.g., "â‚¹1,50,000")
        timeline: Project timeline
        send_email: Whether to email the PDF
    
    Returns:
        PDF generation status and download link
    """
    if not check_rate_limit(client_email):
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "rate_limit_exceeded",
                    "message": "Too many requests. Please try again in a minute."
                })
            }]
        }
    
    try:
        # Try to import PDF library
        try:
            from reportlab.lib.pagesizes import letter, A4
            from reportlab.lib import colors
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
            PDF_AVAILABLE = True
        except ImportError:
            PDF_AVAILABLE = False
        
        if not PDF_AVAILABLE:
            log_tool_usage("generate_proposal_pdf", "error", "ReportLab not installed")
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": "pdf_library_missing",
                        "message": "PDF generation requires 'reportlab' library. Install with: pip install reportlab",
                        "alternative": "Proposal saved as JSON. Install reportlab for PDF generation."
                    })
                }]
            }
        
        # Create proposals directory
        proposals_dir = Path(__file__).parent / "data" / "proposals"
        proposals_dir.mkdir(exist_ok=True)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        pdf_filename = f"proposal_{client_name.replace(' ', '_')}_{timestamp}.pdf"
        pdf_path = proposals_dir / pdf_filename
        
        # Create PDF
        doc = SimpleDocTemplate(str(pdf_path), pagesize=A4)
        story = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2563eb'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            spaceBefore=12
        )
        
        # Title
        story.append(Paragraph("PROJECT PROPOSAL", title_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Client Info
        story.append(Paragraph("Prepared For:", heading_style))
        story.append(Paragraph(f"<b>{client_name}</b>", styles['Normal']))
        story.append(Paragraph(f"{client_email}", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Date and Validity
        story.append(Paragraph(f"Date: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Paragraph(f"Valid Until: {(datetime.now() + timedelta(days=30)).strftime('%B %d, %Y')}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Services
        story.append(Paragraph("Proposed Services:", heading_style))
        service_list = [s.strip() for s in services.split(',')]
        for service in service_list:
            story.append(Paragraph(f"â€¢ {service}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Investment
        story.append(Paragraph("Investment:", heading_style))
        story.append(Paragraph(f"<b>Total: {total_amount}</b>", styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Payment Terms
        story.append(Paragraph("Payment Terms:", heading_style))
        payment_data = [
            ['Milestone', 'Payment', 'Percentage'],
            ['Project Kickoff', f"{total_amount.replace('â‚¹', 'â‚¹')} Ã— 30%", '30%'],
            ['Mid-Project', f"{total_amount.replace('â‚¹', 'â‚¹')} Ã— 40%", '40%'],
            ['Final Delivery', f"{total_amount.replace('â‚¹', 'â‚¹')} Ã— 30%", '30%']
        ]
        
        payment_table = Table(payment_data, colWidths=[2.5*inch, 2*inch, 1.5*inch])
        payment_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(payment_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Timeline
        story.append(Paragraph("Timeline:", heading_style))
        story.append(Paragraph(f"Estimated Duration: <b>{timeline}</b>", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # What's Included
        story.append(Paragraph("What's Included:", heading_style))
        includes = [
            "Source code ownership",
            "3 months free support",
            "Deployment assistance",
            "Technical documentation",
            "Training session"
        ]
        for item in includes:
            story.append(Paragraph(f"âœ“ {item}", styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Next Steps
        story.append(Paragraph("Next Steps:", heading_style))
        steps = [
            "1. Review this proposal",
            "2. Schedule discovery call",
            "3. Sign agreement",
            "4. Project kickoff!"
        ]
        for step in steps:
            story.append(Paragraph(step, styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        # Footer
        story.append(Spacer(1, 0.5*inch))
        story.append(Paragraph("CodeSunny - Web & Digital Solutions", styles['Normal']))
        story.append(Paragraph("Email: hello@codesunny.com | Web: https://codesunny.com", styles['Normal']))
        
        # Build PDF
        doc.build(story)
        
        result = {
            "status": "success",
            "pdf_generated": True,
            "filename": pdf_filename,
            "path": str(pdf_path),
            "client_name": client_name,
            "total_amount": total_amount,
            "generated_at": datetime.now(timezone.utc).isoformat() + "Z"
        }
        
        # Send email if requested
        if send_email:
            email_sent = send_proposal_email(client_name, client_email, pdf_path, total_amount)
            result["email_sent"] = email_sent
        
        log_tool_usage("generate_proposal_pdf", "success")
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result, indent=2)
            }]
        }
        
    except Exception as e:
        log_tool_usage("generate_proposal_pdf", "error", str(e))
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "pdf_generation_failed",
                    "message": str(e)
                })
            }]
        }


def send_proposal_email(client_name: str, client_email: str, pdf_path: Path, amount: str) -> bool:
    """Send proposal PDF via email"""
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    
    if not (host and user and password and email_from):
        return False
    
    try:
        msg = MIMEMultipart()
        msg["Subject"] = f"Your Project Proposal from CodeSunny - {amount}"
        msg["From"] = email_from
        msg["To"] = client_email
        
        body = f"""Hi {client_name},

Thank you for your interest in CodeSunny's services!

Please find attached your personalized project proposal. We've carefully crafted this based on your requirements.

ðŸ“„ Proposal Highlights:
â€¢ Detailed service breakdown
â€¢ Transparent pricing: {amount}
â€¢ Clear timeline and milestones
â€¢ Payment terms
â€¢ What's included

Next Steps:
1. Review the attached proposal
2. Reply with any questions
3. Schedule a discovery call: https://codesunny.com/book-call
4. Let's build something amazing together!

The proposal is valid for 30 days.

Looking forward to working with you!

Best regards,
CodeSunny Team
https://codesunny.com
"""
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Attach PDF
        with pdf_path.open('rb') as f:
            pdf_attachment = MIMEApplication(f.read(), _subtype='pdf')
            pdf_attachment.add_header('Content-Disposition', 'attachment', filename=pdf_path.name)
            msg.attach(pdf_attachment)
        
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
        
        return True
    except Exception as e:
        print(f"Email send error: {e}")
        return False


@mcp.tool()
def update_lead_stage(lead_email: str, new_stage: str, notes: str = ""):
    """
    Update lead stage in CRM pipeline.
    CRITICAL for revenue tracking and pipeline management.
    
    Args:
        lead_email: Lead's email (unique identifier)
        new_stage: New stage - new, contacted, qualified, proposal_sent, negotiation, closed_won, closed_lost
        notes: Optional notes about the stage change
    
    Returns:
        Updated lead status
    """
    valid_stages = ["new", "contacted", "qualified", "proposal_sent", "negotiation", "closed_won", "closed_lost"]
    
    if new_stage not in valid_stages:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "invalid_stage",
                    "message": f"Stage must be one of: {', '.join(valid_stages)}"
                })
            }]
        }
    
    try:
        crm_leads, err = load_crm_leads()
        if err:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": err,
                        "message": "CRM storage is unavailable. Configure MongoDB."
                    })
                }]
            }

        lead = next((x for x in crm_leads if x.get("email", "").lower() == lead_email.lower()), None)
        if not lead:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": "lead_not_found",
                        "message": f"No lead found with email: {lead_email}"
                    })
                }]
            }

        old_stage = lead.get("status", "new")
        stage_probability = {
            "new": 10,
            "contacted": 20,
            "qualified": 40,
            "proposal_sent": 60,
            "negotiation": 80,
            "closed_won": 100,
            "closed_lost": 0
        }
        stage_history = lead.get("stage_history", [])
        stage_history.append({
            "from": old_stage,
            "to": new_stage,
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
            "notes": notes
        })

        updated, update_err = update_crm_lead_by_email(
            lead_email,
            {
                "status": new_stage,
                "last_updated": datetime.now(timezone.utc).isoformat() + "Z",
                "stage_history": stage_history,
                "deal_probability": stage_probability.get(new_stage, 10),
            },
        )
        if not updated:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": update_err,
                        "message": "Failed to update lead stage"
                    })
                }]
            }
        
        log_tool_usage("update_lead_stage", "success")
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "status": "updated",
                    "email": lead_email,
                    "new_stage": new_stage,
                    "deal_probability": stage_probability.get(new_stage, 10),
                    "message": f"Lead moved to '{new_stage}' stage"
                })
            }]
        }
        
    except Exception as e:
        log_tool_usage("update_lead_stage", "error", str(e))
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "update_failed",
                    "message": str(e)
                })
            }]
        }


@mcp.tool()
def get_pipeline_summary():
    """
    Get CRM pipeline summary with revenue projections.
    CRITICAL for business intelligence and forecasting.
    
    Returns:
        Pipeline summary with stage breakdown and revenue forecast
    """
    try:
        crm_leads, err = load_crm_leads()
        if err:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": err,
                        "message": "CRM storage is unavailable. Configure MongoDB."
                    })
                }]
            }

        if not crm_leads:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "message": "No leads in pipeline yet",
                        "total_leads": 0
                    })
                }]
            }
        
        # Initialize counters
        pipeline = {
            "total_leads": len(crm_leads),
            "by_stage": defaultdict(int),
            "by_quality": defaultdict(int),
            "revenue_forecast": {
                "potential": 0,
                "weighted": 0,
                "closed_won": 0
            },
            "conversion_metrics": {
                "total_contacted": 0,
                "total_qualified": 0,
                "total_proposals": 0,
                "total_won": 0,
                "total_lost": 0
            }
        }
        
        # Analyze leads
        for lead in crm_leads:
            stage = lead.get("status", "new")
            quality = lead.get("quality", "cold")
            budget = lead.get("budget", "")
            probability = lead.get("deal_probability", 10)
            
            pipeline["by_stage"][stage] += 1
            pipeline["by_quality"][quality] += 1
            
            # Extract budget amount (rough estimation)
            budget_amount = 0
            if budget:
                # Try to extract number from budget string
                numbers = re.findall(r'\d+', budget.replace(',', ''))
                if numbers:
                    budget_amount = int(numbers[0])
                    if budget_amount < 1000:  # Likely in thousands
                        budget_amount *= 1000
            
            # Revenue calculations
            if budget_amount > 0:
                pipeline["revenue_forecast"]["potential"] += budget_amount
                pipeline["revenue_forecast"]["weighted"] += int(budget_amount * (probability / 100))
            
            if stage == "closed_won":
                pipeline["revenue_forecast"]["closed_won"] += budget_amount
            
            # Conversion metrics
            if stage in ["contacted", "qualified", "proposal_sent", "negotiation", "closed_won"]:
                pipeline["conversion_metrics"]["total_contacted"] += 1
            if stage in ["qualified", "proposal_sent", "negotiation", "closed_won"]:
                pipeline["conversion_metrics"]["total_qualified"] += 1
            if stage in ["proposal_sent", "negotiation", "closed_won"]:
                pipeline["conversion_metrics"]["total_proposals"] += 1
            if stage == "closed_won":
                pipeline["conversion_metrics"]["total_won"] += 1
            if stage == "closed_lost":
                pipeline["conversion_metrics"]["total_lost"] += 1
        
        # Calculate conversion rates
        if pipeline["conversion_metrics"]["total_contacted"] > 0:
            pipeline["conversion_metrics"]["contact_to_qualified_rate"] = round(
                (pipeline["conversion_metrics"]["total_qualified"] / pipeline["conversion_metrics"]["total_contacted"]) * 100, 1
            )
        
        if pipeline["conversion_metrics"]["total_proposals"] > 0:
            pipeline["conversion_metrics"]["proposal_to_won_rate"] = round(
                (pipeline["conversion_metrics"]["total_won"] / pipeline["conversion_metrics"]["total_proposals"]) * 100, 1
            )
        
        # Format revenue
        pipeline["revenue_forecast"]["potential"] = f"â‚¹{pipeline['revenue_forecast']['potential']:,}"
        pipeline["revenue_forecast"]["weighted"] = f"â‚¹{pipeline['revenue_forecast']['weighted']:,}"
        pipeline["revenue_forecast"]["closed_won"] = f"â‚¹{pipeline['revenue_forecast']['closed_won']:,}"
        
        # Convert defaultdicts to regular dicts
        pipeline["by_stage"] = dict(pipeline["by_stage"])
        pipeline["by_quality"] = dict(pipeline["by_quality"])
        
        pipeline["generated_at"] = datetime.now(timezone.utc).isoformat() + "Z"
        
        log_tool_usage("get_pipeline_summary", "success")
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(pipeline, indent=2)
            }]
        }
        
    except Exception as e:
        log_tool_usage("get_pipeline_summary", "error", str(e))
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "pipeline_summary_failed",
                    "message": str(e)
                })
            }]
        }


@mcp.tool()
def generate_payment_link_razorpay(
    client_name: str,
    client_email: str,
    amount: int,
    description: str = "Project Payment",
    currency: str = "INR"
):
    """
    Generate Razorpay payment link for instant payments.
    CRITICAL for revenue automation - converts proposals to payments.
    
    Args:
        client_name: Client's name
        client_email: Client's email
        amount: Amount in smallest currency unit (e.g., 150000 for â‚¹1,500)
        description: Payment description
        currency: Currency code (INR, USD, etc.)
    
    Returns:
        Payment link and tracking details
    """
    razorpay_key = os.environ.get("RAZORPAY_KEY_ID")
    razorpay_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    
    if not (razorpay_key and razorpay_secret):
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "razorpay_not_configured",
                    "message": "Razorpay API keys not configured",
                    "instructions": "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file",
                    "alternative": "Manual payment link: Share bank details or UPI"
                })
            }]
        }
    
    try:
        import razorpay
        client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
        
        # Create payment link
        payment_link_data = {
            "amount": amount * 100,  # Convert to paise
            "currency": currency,
            "description": description,
            "customer": {
                "name": client_name,
                "email": client_email
            },
            "notify": {
                "sms": False,
                "email": True
            },
            "reminder_enable": True,
            "callback_url": "https://codesunny.com/payment-success",
            "callback_method": "get"
        }
        
        payment_link = client.payment_link.create(payment_link_data)
        
        # Save payment record
        payments_file = Path(__file__).parent / "data" / "payments.json"
        if payments_file.exists():
            with payments_file.open("r", encoding="utf-8") as f:
                payments = json.load(f)
        else:
            payments = []
        
        payment_record = {
            "payment_link_id": payment_link["id"],
            "client_name": client_name,
            "client_email": client_email,
            "amount": amount,
            "currency": currency,
            "description": description,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat() + "Z",
            "short_url": payment_link.get("short_url", "")
        }
        
        payments.append(payment_record)
        
        with payments_file.open("w", encoding="utf-8") as f:
            json.dump(payments, f, indent=2)
        
        log_tool_usage("generate_payment_link_razorpay", "success")
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "status": "success",
                    "payment_link": payment_link.get("short_url", payment_link.get("url", "")),
                    "payment_id": payment_link["id"],
                    "amount": f"â‚¹{amount:,}",
                    "client": client_name,
                    "message": "Payment link generated successfully. Share this with your client."
                }, indent=2)
            }]
        }
        
    except ImportError:
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "razorpay_library_missing",
                    "message": "Install razorpay library: pip install razorpay",
                    "alternative": "Use manual payment collection"
                })
            }]
        }
    except Exception as e:
        log_tool_usage("generate_payment_link_razorpay", "error", str(e))
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "payment_link_failed",
                    "message": str(e)
                })
            }]
        }


@mcp.tool()
def monthly_revenue_projection(months: int = 3):
    """
    Project revenue for next N months based on pipeline.
    CRITICAL for business planning and forecasting.
    
    Args:
        months: Number of months to project (default: 3)
    
    Returns:
        Revenue projection with confidence levels
    """
    try:
        crm_leads, err = load_crm_leads()
        if err:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "error": err,
                        "message": "CRM storage is unavailable. Configure MongoDB."
                    })
                }]
            }

        if not crm_leads:
            return {
                "content": [{
                    "type": "text",
                    "text": json.dumps({
                        "message": "No pipeline data available for projection",
                        "projected_revenue": "₹0"
                    })
                }]
            }

        # Calculate projections
        projections = {
            "conservative": 0,  # Only high-probability deals
            "realistic": 0,     # Weighted by probability
            "optimistic": 0     # All active deals
        }
        
        active_stages = ["qualified", "proposal_sent", "negotiation"]
        
        for lead in crm_leads:
            stage = lead.get("status", "new")
            budget = lead.get("budget", "")
            probability = lead.get("deal_probability", 10)
            
            if stage not in active_stages:
                continue
            
            # Extract budget
            budget_amount = 0
            if budget:
                numbers = re.findall(r'\d+', budget.replace(',', ''))
                if numbers:
                    budget_amount = int(numbers[0])
                    if budget_amount < 1000:
                        budget_amount *= 1000
            
            if budget_amount > 0:
                # Conservative: Only deals > 70% probability
                if probability >= 70:
                    projections["conservative"] += budget_amount
                
                # Realistic: Weighted by probability
                projections["realistic"] += int(budget_amount * (probability / 100))
                
                # Optimistic: All deals
                projections["optimistic"] += budget_amount
        
        result = {
            "projection_period": f"{months} months",
            "generated_at": datetime.now(timezone.utc).isoformat() + "Z",
            "projections": {
                "conservative": f"â‚¹{projections['conservative']:,}",
                "realistic": f"â‚¹{projections['realistic']:,}",
                "optimistic": f"â‚¹{projections['optimistic']:,}"
            },
            "monthly_average": {
                "conservative": f"â‚¹{projections['conservative'] // months:,}",
                "realistic": f"â‚¹{projections['realistic'] // months:,}",
                "optimistic": f"â‚¹{projections['optimistic'] // months:,}"
            },
            "confidence_level": "Medium" if projections["realistic"] > 0 else "Low",
            "recommendations": []
        }
        
        # Add recommendations
        if projections["realistic"] < 100000:
            result["recommendations"].append("Focus on lead generation - pipeline is thin")
        if projections["conservative"] < projections["realistic"] * 0.3:
            result["recommendations"].append("Work on moving deals to higher probability stages")
        if projections["optimistic"] > projections["realistic"] * 3:
            result["recommendations"].append("Many low-probability deals - focus on qualification")
        
        log_tool_usage("monthly_revenue_projection", "success")
        
        return {
            "content": [{
                "type": "text",
                "text": json.dumps(result, indent=2)
            }]
        }
        
    except Exception as e:
        log_tool_usage("monthly_revenue_projection", "error", str(e))
        return {
            "content": [{
                "type": "text",
                "text": json.dumps({
                    "error": "projection_failed",
                    "message": str(e)
                })
            }]
        }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    
    # Build ASGI app - try both methods
    ts = _get_transport_security()
    if hasattr(mcp, "streamable_http_app"):
        try:
            app = mcp.streamable_http_app(transport_security=ts) if ts else mcp.streamable_http_app()
        except TypeError:
            app = mcp.streamable_http_app()
    else:
        try:
            app = mcp.http_app(transport_security=ts) if ts else mcp.http_app()
        except TypeError:
            app = mcp.http_app()
    
    import uvicorn
    print(f"Starting MCP server on http://0.0.0.0:{port}")
    print("Available routes:")
    if hasattr(app, "routes"):
        for route in app.routes:
            print(f"  {route}")
    uvicorn.run(app, host="0.0.0.0", port=port)
