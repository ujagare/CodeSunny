"""
Inbound Email AI Agent

Reads unread client emails from inbox and sends AI-generated replies
based on client requirement and CodeSunny's six services.
"""

import email
import imaplib
import os
import re
import json
import smtplib
from datetime import datetime, timezone
from email.header import decode_header
from email.message import EmailMessage
from pathlib import Path

from dotenv import load_dotenv

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")

SERVICES = [
    "Web Development",
    "E-commerce Solutions",
    "UI/UX Design",
    "SEO Optimization",
    "Digital Marketing",
    "AI Solutions & Chatbots",
]
BRAND_SIGNATURE_EN = (
    "Best regards,\n"
    "CodeSunny Team\n"
    "Web & Digital Solutions\n"
    "Email: information@codesunny.in | Phone: +91 89758075789 | https://codesunny.com"
)
BRAND_SIGNATURE_HI = (
    "Dhanyavaad,\n"
    "CodeSunny Team\n"
    "Web & Digital Solutions\n"
    "Email: information@codesunny.in | Phone: +91 89758075789 | https://codesunny.com"
)


def decode_text(value: str) -> str:
    if not value:
        return ""
    parts = decode_header(value)
    out = []
    for chunk, enc in parts:
        if isinstance(chunk, bytes):
            out.append(chunk.decode(enc or "utf-8", errors="ignore"))
        else:
            out.append(chunk)
    return "".join(out).strip()


def extract_plain_text(msg) -> str:
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            disp = str(part.get("Content-Disposition", ""))
            if ctype == "text/plain" and "attachment" not in disp:
                payload = part.get_payload(decode=True)
                if payload:
                    return payload.decode(errors="ignore").strip()
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            return payload.decode(errors="ignore").strip()
    return ""


def get_ai_client():
    groq_client = None
    gemini_client = None

    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    if GROQ_AVAILABLE and groq_key:
        groq_client = Groq(api_key=groq_key)

    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if GEMINI_AVAILABLE and gemini_key:
        gemini_client = create_gemini_model(
            gemini_key,
            os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
        )

    return groq_client, gemini_client


def detect_language(text: str) -> str:
    content = text or ""
    if re.search(r"[\u0900-\u097F]", content):
        return "hi"
    roman_hi_markers = [
        "namaste", "nahi", "hai", "hume", "mujhe", "chahiye", "kripya",
        "aap", "karna", "kijiye", "kaise", "kitna", "sampark",
    ]
    if any(token in content.lower() for token in roman_hi_markers):
        return "hi"
    return "en"


def sanitize_claims(text: str) -> str:
    return re.sub(
        r"\b\d+\s*%\s+(increase|decrease|growth|boost|improvement)\b",
        "measurable improvement",
        text,
        flags=re.IGNORECASE,
    )


def enforce_professional_reply(client_name: str, subject: str, body: str, language: str):
    out_subject = (subject or "").strip()
    if out_subject and not out_subject.lower().startswith("re:"):
        out_subject = f"Re: {out_subject}"
    if not out_subject:
        out_subject = "Re: Your Query - CodeSunny"

    out_body = (body or "").strip()
    out_body = out_body.replace("Dear Prospect,", f"Hi {client_name},")
    out_body = out_body.replace("Dear Client,", f"Hi {client_name},")
    out_body = sanitize_claims(out_body)

    if not out_body.lower().startswith(f"hi {client_name.lower()}"):
        out_body = f"Hi {client_name},\n\n{out_body}"

    signature = BRAND_SIGNATURE_HI if language == "hi" else BRAND_SIGNATURE_EN
    if "codesunny team" not in out_body.lower():
        out_body = f"{out_body}\n\n{signature}"

    return out_subject, out_body


def generate_ai_reply(client_name: str, subject: str, body: str) -> tuple[str, str]:
    groq_client, gemini_client = get_ai_client()
    language = detect_language(f"{subject}\n{body}")

    prompt = f"""
You are CodeSunny's email assistant.

Client name: {client_name or "Client"}
Client subject: {subject}
Client email body:
{body[:2500]}

Available services:
{", ".join(SERVICES)}
Output language: {"Hindi/Hinglish" if language == "hi" else "English"}

Task:
1) Understand client requirement.
2) Reply professionally and clearly.
3) Mention only relevant services.
4) Ask max 2 clarifying questions if needed.
5) Add one CTA: schedule call or request details.
6) Opening must be "Hi {client_name},"
7) Do not use fake claims or unsupported percentages.

Return only JSON:
{{
  "subject": "...",
  "body": "..."
}}
""".strip()

    raw = ""
    if groq_client:
        model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
        resp = groq_client.chat.completions.create(
            model=model,
            temperature=0.4,
            max_tokens=550,
            messages=[
                {"role": "system", "content": "Return valid JSON only."},
                {"role": "user", "content": prompt},
            ],
        )
        raw = resp.choices[0].message.content or ""
    elif gemini_client:
        resp = gemini_client.generate_content(prompt)
        raw = resp.text or ""
    else:
        # Safe fallback
        fallback = (
            f"Re: {subject}" if subject else "Re: Your Query - CodeSunny",
            "Thank you for reaching out. Please share your exact requirements, preferred timeline, and budget so we can suggest the best service package for you.",
        )
        return enforce_professional_reply(client_name, fallback[0], fallback[1], language)

    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1 or end <= start:
        fallback = (
            f"Re: {subject}" if subject else "Re: Your Query - CodeSunny",
            "Thank you for your email. We reviewed your requirement and our team can help. Please share your timeline and budget so we can send a precise proposal.",
        )
        return enforce_professional_reply(client_name, fallback[0], fallback[1], language)

    data = json.loads(raw[start : end + 1])
    out_subject = (data.get("subject") or "").strip() or (
        f"Re: {subject}" if subject else "Re: Your Query - CodeSunny"
    )
    out_body = (data.get("body") or "").strip() or (
        "Thank you for your message. We can help. Please share key details to proceed."
    )
    return enforce_professional_reply(client_name, out_subject, out_body, language)


def send_reply(to_email: str, subject: str, body: str):
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    if not all([host, user, password, email_from]):
        raise RuntimeError("SMTP not configured")

    msg = EmailMessage()
    msg["From"] = email_from
    msg["To"] = to_email
    clean_subject = re.sub(r"[^\w\s\-\|\:\,\.\(\)\/&+]", "", subject or "").strip()
    msg["Subject"] = clean_subject or "Re: Your Query - CodeSunny"
    msg["Reply-To"] = email_from
    msg.set_content(body)
    html_body = (
        f"<div style='font-family:Arial,sans-serif;line-height:1.7;color:#1f2937;'>"
        f"<p>{body.replace(chr(10), '<br/>')}</p>"
        f"<div style='margin-top:20px;padding-top:14px;border-top:1px solid #e5e7eb;'>"
        f"<p style='margin:0;font-size:13px;color:#334155;line-height:1.6;'>"
        f"<strong>CodeSunny Team</strong><br/>"
        f"Web &amp; Digital Solutions<br/>"
        f"Email: <a href='mailto:information@codesunny.in'>information@codesunny.in</a> | "
        f"Phone: <a href='tel:+918975807578'>+91 89758075789</a><br/>"
        f"<a href='https://codesunny.com'>codesunny.com</a>"
        f"</p></div></div>"
    )
    msg.add_alternative(html_body, subtype="html")

    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=30) as server:
            server.login(user, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=30) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)


def process_unread():
    imap_host = os.environ.get("IMAP_HOST", "").strip()
    imap_port = int(os.environ.get("IMAP_PORT", "993"))
    imap_user = os.environ.get("IMAP_USER", "").strip()
    imap_pass = os.environ.get("IMAP_PASS", "").strip()
    own_email = (os.environ.get("SMTP_FROM", "") or "").lower()

    if not all([imap_host, imap_user, imap_pass]):
        print("IMAP not configured. Set IMAP_HOST/IMAP_USER/IMAP_PASS")
        return

    with imaplib.IMAP4_SSL(imap_host, imap_port) as mail:
        mail.login(imap_user, imap_pass)
        mail.select("INBOX")
        status, data = mail.search(None, "UNSEEN")
        if status != "OK":
            print("Failed to search inbox")
            return

        ids = data[0].split()
        if not ids:
            print("No unread emails.")
            return

        for msg_id in ids:
            status, msg_data = mail.fetch(msg_id, "(RFC822)")
            if status != "OK" or not msg_data:
                continue

            raw_email = msg_data[0][1]
            msg = email.message_from_bytes(raw_email)
            sender = decode_text(msg.get("From", ""))
            subject = decode_text(msg.get("Subject", ""))
            body = extract_plain_text(msg)

            m = re.search(r"<([^>]+)>", sender)
            sender_email = (m.group(1) if m else sender).strip().lower()
            if not sender_email or sender_email == own_email:
                continue

            auto_submitted = (msg.get("Auto-Submitted", "") or "").lower()
            if auto_submitted and auto_submitted != "no":
                continue

            client_name = sender.split("<")[0].strip() or "Client"
            reply_subject, reply_body = generate_ai_reply(client_name, subject, body)
            send_reply(sender_email, reply_subject, reply_body)

            print(
                f"[{datetime.now(timezone.utc).isoformat()}] Replied to {sender_email} | Subject: {reply_subject}"
            )


if __name__ == "__main__":
    process_unread()
