"""
Automation Hub for CodeSunny MCP

Runs scheduled business automations:
- Mongo -> Google Sheets sync
- Hot lead alerts (email + webhook)
- Daily/weekly KPI digest
- Weekly SEO reports
- Uptime + SSL checks
- Mongo backup snapshots
"""

from __future__ import annotations

import json
import os
import smtplib
import ssl
import time
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from typing import Dict, List
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv

try:
    from pymongo import MongoClient

    PYMONGO_AVAILABLE = True
except Exception:
    PYMONGO_AVAILABLE = False

load_dotenv(Path(__file__).parent / ".env")

DATA_DIR = Path(__file__).parent / "data"
STATE_FILE = DATA_DIR / "automation_state.json"
BACKUP_DIR = DATA_DIR / "backups"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat() + "Z"


def load_state() -> Dict:
    if not STATE_FILE.exists():
        return {
            "last_sheets_sync": "",
            "last_daily_digest": "",
            "last_weekly_digest": "",
            "last_weekly_seo": "",
            "last_backup": "",
            "hot_alerted_ids": [],
        }
    return json.loads(STATE_FILE.read_text(encoding="utf-8"))


def save_state(state: Dict):
    DATA_DIR.mkdir(exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


def get_db():
    if not PYMONGO_AVAILABLE:
        return None
    uri = os.environ.get("MONGODB_URI", "").strip()
    db_name = os.environ.get("MONGODB_DB", "codesunny").strip()
    if not uri:
        return None
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=10000)
        client.admin.command("ping")
        return client[db_name]
    except Exception as e:
        print(f"[automation_hub] Mongo unavailable: {e}")
        return None


def send_email(subject: str, body: str, to_email: str = "") -> bool:
    host = os.environ.get("SMTP_HOST", "").strip()
    port = int(os.environ.get("SMTP_PORT", "465"))
    user = os.environ.get("SMTP_USER", "").strip()
    password = os.environ.get("SMTP_PASS", "").strip()
    sender = os.environ.get("SMTP_FROM", "").strip()
    target = (to_email or os.environ.get("LEADS_EMAIL_TO", "")).strip()

    if not all([host, user, password, sender, target]):
        return False

    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = target
    msg["Subject"] = subject
    msg.set_content(body)

    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port, timeout=30) as server:
                server.login(user, password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(host, port, timeout=30) as server:
                server.starttls()
                server.login(user, password)
                server.send_message(msg)
        return True
    except Exception as e:
        print(f"[automation_hub] send_email failed: {e}")
        return False


def fetch_new_leads_since(db, last_sync_iso: str) -> List[Dict]:
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
    query = {}
    if last_sync_iso:
        query["updated_at"] = {"$gt": last_sync_iso}
    return list(col.find(query).sort("updated_at", 1).limit(500))


def sync_to_google_sheets(db, state: Dict):
    webhook = os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()
    if not webhook:
        return
    leads = fetch_new_leads_since(db, state.get("last_sheets_sync", ""))
    if not leads:
        return

    last_seen = state.get("last_sheets_sync", "")
    for lead in leads:
        payload = {
            "event": "lead_sync",
            "source": "automation_hub",
            "lead": {
                "name": lead.get("name", ""),
                "email": lead.get("email", ""),
                "message": lead.get("message", ""),
                "lead_score": lead.get("lead_score", 0),
                "quality": lead.get("quality", ""),
                "status": lead.get("status", "new"),
                "services_interested": lead.get("services_interested", []),
                "created_at": lead.get("created_at", ""),
                "updated_at": lead.get("updated_at", ""),
            },
        }
        try:
            res = requests.post(webhook, json=payload, timeout=10)
            if res.ok:
                last_seen = max(last_seen, lead.get("updated_at", "") or "")
        except Exception as e:
            print(f"[automation_hub] sheets sync item failed: {e}")

    state["last_sheets_sync"] = last_seen


def process_hot_lead_alerts(db, state: Dict):
    webhook = os.environ.get("LEAD_AUTOMATION_WEBHOOK_URL", "").strip()
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
    hot_leads = list(col.find({"quality": "hot"}).sort("updated_at", -1).limit(200))

    alerted = set(state.get("hot_alerted_ids", []))
    for lead in hot_leads:
        lid = str(lead.get("_id"))
        if lid in alerted:
            continue
        summary = (
            "Hot lead detected\n"
            f"Name: {lead.get('name','')}\n"
            f"Email: {lead.get('email','')}\n"
            f"Score: {lead.get('lead_score', 0)}\n"
            f"Status: {lead.get('status', 'new')}\n"
            f"Message: {lead.get('message','')[:500]}"
        )
        send_email("Hot Lead Alert - CodeSunny", summary)
        if webhook:
            try:
                requests.post(
                    webhook,
                    json={"event": "hot_lead", "lead": lead, "timestamp": now_iso()},
                    timeout=10,
                )
            except Exception:
                pass
        alerted.add(lid)

    state["hot_alerted_ids"] = list(alerted)[-1000:]


def build_kpi_digest(db, label: str) -> str:
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
    total = col.count_documents({})
    status_counts = {}
    quality_counts = {}

    for lead in col.find({}, {"status": 1, "quality": 1, "lead_score": 1}):
        s = lead.get("status", "new")
        q = lead.get("quality", "cold")
        status_counts[s] = status_counts.get(s, 0) + 1
        quality_counts[q] = quality_counts.get(q, 0) + 1

    avg_score = 0.0
    scores = [x.get("lead_score", 0) for x in col.find({}, {"lead_score": 1})]
    if scores:
        avg_score = sum(scores) / len(scores)

    lines = [
        f"{label} KPI Digest - CodeSunny",
        f"Generated: {now_iso()}",
        "",
        f"Total Leads: {total}",
        f"Average Lead Score: {avg_score:.1f}",
        "",
        "Status Breakdown:",
    ]
    for k, v in sorted(status_counts.items(), key=lambda x: x[0]):
        lines.append(f"- {k}: {v}")

    lines.append("")
    lines.append("Quality Breakdown:")
    for k, v in sorted(quality_counts.items(), key=lambda x: x[0]):
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("Recommended Actions:")
    lines.append("- Contact all hot leads within 1 hour.")
    lines.append("- Move contacted leads to qualified/proposal stages.")
    lines.append("- Review lost leads and capture reason.")

    return "\n".join(lines)


def maybe_send_digests(db, state: Dict):
    today = datetime.now(timezone.utc).date().isoformat()
    weekday = datetime.now(timezone.utc).weekday()  # 0=Mon, 6=Sun

    if state.get("last_daily_digest") != today:
        body = build_kpi_digest(db, "Daily")
        if send_email("Daily KPI Digest - CodeSunny", body):
            state["last_daily_digest"] = today

    # Weekly digest on Monday
    if weekday == 0 and state.get("last_weekly_digest") != today:
        body = build_kpi_digest(db, "Weekly")
        if send_email("Weekly KPI Digest - CodeSunny", body):
            state["last_weekly_digest"] = today


def run_weekly_seo_report(state: Dict):
    key = os.environ.get("GOOGLE_PAGESPEED_API_KEY", "").strip()
    urls_raw = os.environ.get("SEO_REPORT_URLS", "").strip()
    if not key or not urls_raw:
        return

    today = datetime.now(timezone.utc).date().isoformat()
    weekday = datetime.now(timezone.utc).weekday()  # Monday=0
    if weekday != 0 or state.get("last_weekly_seo") == today:
        return

    urls = [u.strip() for u in urls_raw.split(",") if u.strip()]
    report_lines = [f"Weekly SEO Report - {today}", ""]

    for u in urls[:20]:
        try:
            api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
            r = requests.get(
                api,
                params={"url": u, "strategy": "mobile", "key": key},
                timeout=30,
            )
            if not r.ok:
                report_lines.append(f"- {u}: failed ({r.status_code})")
                continue
            j = r.json()
            lhr = j.get("lighthouseResult", {}).get("categories", {})
            perf = int(round((lhr.get("performance", {}).get("score", 0) or 0) * 100))
            seo = int(round((lhr.get("seo", {}).get("score", 0) or 0) * 100))
            report_lines.append(f"- {u}: Performance {perf}/100, SEO {seo}/100")
        except Exception as e:
            report_lines.append(f"- {u}: error ({e})")

    report_lines.append("")
    report_lines.append("Priority Actions:")
    report_lines.append("- Fix pages with Performance < 70 first.")
    report_lines.append("- Improve metadata and internal linking for SEO < 80.")
    send_email("Weekly SEO Report - CodeSunny", "\n".join(report_lines))
    state["last_weekly_seo"] = today


def check_uptime_and_ssl():
    domains_raw = os.environ.get("MONITOR_DOMAINS", "").strip()
    if not domains_raw:
        return

    domains = [d.strip() for d in domains_raw.split(",") if d.strip()]
    alerts = []
    for d in domains[:30]:
        url = d if d.startswith("http") else f"https://{d}"
        try:
            r = requests.get(url, timeout=12, allow_redirects=True)
            if r.status_code >= 400:
                alerts.append(f"{url} returned {r.status_code}")

            host = urlparse(url).hostname
            if host:
                context = ssl.create_default_context()
                with ssl.create_connection((host, 443), timeout=10) as sock:
                    with context.wrap_socket(sock, server_hostname=host) as ssock:
                        cert = ssock.getpeercert()
                        if not cert:
                            alerts.append(f"{url} SSL certificate missing")
        except Exception as e:
            alerts.append(f"{url} check failed: {e}")

    if alerts:
        send_email("Uptime/SSL Alert - CodeSunny", "\n".join(alerts))


def maybe_backup_mongo(db, state: Dict):
    today = datetime.now(timezone.utc).date().isoformat()
    if state.get("last_backup") == today:
        return
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    col = db[os.environ.get("MONGODB_LEADS_COLLECTION", "leads")]
    docs = list(col.find({}))
    for d in docs:
        d["_id"] = str(d.get("_id"))
    backup_file = BACKUP_DIR / f"leads_backup_{today}.json"
    backup_file.write_text(json.dumps(docs, indent=2), encoding="utf-8")
    state["last_backup"] = today


def run_once():
    db = get_db()
    if db is None:
        print("[automation_hub] Mongo DB not available. Exiting.")
        return

    state = load_state()
    sync_to_google_sheets(db, state)
    process_hot_lead_alerts(db, state)
    maybe_send_digests(db, state)
    run_weekly_seo_report(state)
    check_uptime_and_ssl()
    maybe_backup_mongo(db, state)
    save_state(state)
    print("[automation_hub] cycle complete")


if __name__ == "__main__":
    mode = os.environ.get("AUTOMATION_HUB_MODE", "once").strip().lower()
    poll = int(os.environ.get("AUTOMATION_POLL_SECONDS", "300"))

    if mode == "loop":
        print(f"[automation_hub] loop mode every {poll} seconds")
        while True:
            try:
                run_once()
            except Exception as e:
                print(f"[automation_hub] cycle error: {e}")
            time.sleep(max(60, poll))
    else:
        run_once()
