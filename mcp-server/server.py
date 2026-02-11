from mcp.server.fastmcp import FastMCP
from openai import OpenAI
import json
import os
from pathlib import Path
import re
from datetime import datetime
import smtplib
from email.message import EmailMessage

DATA_PATH = Path(__file__).parent / "data" / "site_index.json"
LEADS_PATH = Path(__file__).parent / "data" / "leads.json"


def load_docs():
    if not DATA_PATH.exists():
        return []
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip().lower()


mcp = FastMCP("CodeSunny MCP")
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


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

    msg = EmailMessage()
    msg["Subject"] = f"New Lead: {lead.get('name','')}"
    msg["From"] = email_from
    msg["To"] = email_to
    msg.set_content(json.dumps(lead, indent=2))

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        server.send_message(msg)
    return True


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
    model = os.environ.get("OPENAI_MODEL")
    if not model:
        return {
            "content": [
                {
                    "type": "text",
                    "text": json.dumps(
                        {"error": "OPENAI_MODEL not set in environment"}
                    ),
                }
            ]
        }

    docs = rank_docs(message, limit=3)
    context = "\n".join(
        [f"- {d['title']}: {d['text']} ({d['url']})" for d in docs]
    )

    system = (
        "You are CodeSunny's support assistant. "
        "Be concise, helpful, and suggest relevant service pages. "
        "If you are unsure, ask a short clarifying question."
    )
    user = f"User: {message}\n\nRelevant pages:\n{context}"

    response = client.responses.create(
        model=model,
        input=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.4,
    )

    text = response.output_text or ""
    return {
        "content": [
            {
                "type": "text",
                "text": json.dumps({"reply": text}),
            }
        ]
    }


if __name__ == "__main__":
    # Render provides PORT; bind to 0.0.0.0 so Render can reach it.
    port = int(os.environ.get("PORT", "8000"))

    # Build an ASGI app explicitly to control host/port across SDK versions.
    if hasattr(mcp, "streamable_http_app"):
        app = mcp.streamable_http_app()
    else:
        app = mcp.http_app()

    import uvicorn
    try:
        from starlette.middleware.trustedhost import TrustedHostMiddleware

        if hasattr(app, "add_middleware"):
            app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
    except Exception:
        pass

    uvicorn.run(app, host="0.0.0.0", port=port)
