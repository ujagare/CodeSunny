from mcp.server.fastmcp import FastMCP
from urllib.parse import urlparse
import inspect
from openai import OpenAI
import json
import os
from pathlib import Path
import re
from datetime import datetime
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(Path(__file__).parent / ".env")

# Try to import Groq as fallback
try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

# Try to import Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

DATA_PATH = Path(__file__).parent / "data" / "site_index.json"
LEADS_PATH = Path(__file__).parent / "data" / "leads.json"


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
    if os.environ.get("RENDER_EXTERNAL_HOSTNAME") and "MCP_DISABLE_DNS_REBINDING" not in os.environ:
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

# Debug: Print what keys are found
print(f"Environment keys found:")
print(f"  - OPENAI_API_KEY: {openai_key[:20] if openai_key else 'None'}...")
print(f"  - GROQ_API_KEY: {groq_key[:20] if groq_key else 'None'}...")
print(f"  - GEMINI_API_KEY: {gemini_key[:20] if gemini_key else 'None'}...")

openai_client = OpenAI(api_key=openai_key) if openai_key and openai_key != "your_openai_api_key_here" and not openai_key.startswith("#") else None
groq_client = Groq(api_key=groq_key) if GROQ_AVAILABLE and groq_key and groq_key != "your_groq_api_key_here" else None

# Initialize Gemini
gemini_client = None
if GEMINI_AVAILABLE and gemini_key and gemini_key != "your_gemini_api_key_here":
    genai.configure(api_key=gemini_key)
    gemini_client = genai.GenerativeModel('gemini-pro')

# Use whichever client is available (priority: Groq > OpenAI > Gemini)
client = groq_client or openai_client or gemini_client
client_type = "groq" if groq_client else ("openai" if openai_client else ("gemini" if gemini_client else None))

# Debug: Print which client is being used
print(f"AI Client initialized: {client_type}")
if client_type:
    print(f"  - OpenAI: {'✓' if openai_client else '✗'}")
    print(f"  - Groq: {'✓' if groq_client else '✗'}")
    print(f"  - Gemini: {'✓' if gemini_client else '✗'}")
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


def send_lead_email(lead):
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    email_to = os.environ.get("LEADS_EMAIL_TO")

    if not (host and user and password and email_from and email_to):
        return False

    # Create HTML email with better formatting
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                🎯 New Lead from CodeSunny Website
            </h2>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>👤 Name:</strong> {lead.get('name', 'N/A')}</p>
                <p style="margin: 10px 0;"><strong>📧 Email:</strong> 
                    <a href="mailto:{lead.get('email', '')}" style="color: #2563eb;">{lead.get('email', 'N/A')}</a>
                </p>
                <p style="margin: 10px 0;"><strong>📅 Date:</strong> {lead.get('created_at', 'N/A')}</p>
            </div>
            
            <div style="margin: 20px 0;">
                <h3 style="color: #475569;">💬 Message:</h3>
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

    msg = EmailMessage()
    msg["Subject"] = f"🎯 New Lead: {lead.get('name','')} - CodeSunny"
    msg["From"] = email_from
    msg["To"] = email_to
    msg["Reply-To"] = lead.get('email', email_from)  # Allow direct reply to lead
    msg.set_content(f"New lead from {lead.get('name', 'Unknown')}\nEmail: {lead.get('email', 'N/A')}\nMessage: {lead.get('message', 'N/A')}")
    msg.add_alternative(html_content, subtype='html')

    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Email send error: {e}")
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
    """Capture a lead and optionally email it."""
    lead = {
        "name": name,
        "email": email,
        "message": message,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    append_lead(lead)
    emailed = False
    try:
        emailed = send_lead_email(lead)
    except Exception:
        emailed = False

    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps(
                    {
                        "status": "received",
                        "emailed": emailed,
                        "name": name,
                        "email": email,
                        "message": message,
                    }
                ),
            }
        ]
    }


@mcp.tool()
def chat(message: str):
    """AI chat with CodeSunny context."""
    docs = rank_docs(message, limit=3)
    
    # Build intelligent fallback response based on search results
    def build_fallback_response():
        if docs:
            # Create a helpful response with search results
            intro = "I found some relevant information for you:\n\n"
            results = []
            for i, doc in enumerate(docs, 1):
                snippet = doc.get('text', '')[:150] + '...' if len(doc.get('text', '')) > 150 else doc.get('text', '')
                results.append(f"{i}. **{doc['title']}**\n   {snippet}\n   🔗 {doc['url']}")
            
            outro = "\n\nWould you like to know more about any of these? Feel free to ask!"
            return intro + "\n\n".join(results) + outro
        else:
            return (
                "Thanks for reaching out! I'm here to help you learn about CodeSunny's services.\n\n"
                "We offer:\n"
                "• Web Development\n"
                "• UI/UX Design\n"
                "• Digital Marketing\n"
                "• E-commerce Solutions\n\n"
                "Visit https://codesunny.com/services to explore our offerings, or ask me anything!"
            )
    
    # Try OpenAI first, fallback to search-based response
    if not client:
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({"reply": build_fallback_response()}),
                }
            ]
        }
    
    # Determine which model to use
    if client_type == "groq":
        model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
    elif client_type == "gemini":
        model = None  # Gemini uses different API
    else:
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    
    context = "\n".join(
        [f"- {d['title']}: {d['text']} ({d['url']})" for d in docs]
    )

    system = (
        "You are CodeSunny's AI assistant - friendly, knowledgeable, and helpful. "
        "CodeSunny is a web development and digital solutions company. "
        "\n\nYour role:\n"
        "- Answer ALL questions about services, technologies, and processes in detail\n"
        "- Provide specific information and examples from the context\n"
        "- Be conversational, engaging, and build rapport with the user\n"
        "- Handle multiple questions in the conversation naturally\n"
        "- Share technical details, timelines, and general process information\n"
        "\nWhen to suggest connecting with the team:\n"
        "ONLY suggest contact when user asks about:\n"
        "- Specific pricing for their project\n"
        "- Custom quotes or estimates\n"
        "- Starting a project or hiring\n"
        "- Detailed project timeline for their specific needs\n"
        "\nFor these cases, say: 'I'd love to connect you with our team for a detailed discussion. "
        "Could you share your name and email so we can reach out?'\n"
        "\nCodeSunny Services:\n"
        "- Web Development: React, Node.js, full-stack solutions, custom web apps\n"
        "- UI/UX Design: Modern interfaces, user research, prototyping, responsive design\n"
        "- E-commerce: Online stores, payment integration, inventory management\n"
        "- Cloud Solutions: AWS deployment, scaling, DevOps, CI/CD\n"
        "- AI Automation: Chatbots, workflow automation, AI integration\n"
        "- SEO: Search rankings, performance optimization, content strategy\n"
        "- N8N Workflows: Business process automation, integrations\n"
        "\nKeep responses informative but concise (3-5 sentences)."
    )
    user = f"User question: {message}\n\nRelevant information:\n{context}"

    try:
        if client_type == "gemini":
            # Gemini API call
            prompt = f"{system}\n\n{user}"
            response = client.generate_content(prompt)
            text = response.text or ""
        else:
            # OpenAI/Groq API call
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=0.4,
            )
            text = response.choices[0].message.content or ""
        
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({"reply": text}),
                }
            ]
        }
    except Exception as e:
        # Log the error for debugging
        print(f"AI API Error ({client_type}): {type(e).__name__}: {str(e)}")
        # Fallback to search-based response on any error (rate limit, no credits, etc.)
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps({"reply": build_fallback_response()}),
                }
            ]
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
    if hasattr(app, 'routes'):
        for route in app.routes:
            print(f"  {route}")
    uvicorn.run(app, host="0.0.0.0", port=port)
