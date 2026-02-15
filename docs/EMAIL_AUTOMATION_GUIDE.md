# 📧 Email Automation Guide - CodeSunny

## ✅ Current Automation (Already Working)

### 1. Lead Capture Auto-Reply ✅

**What Happens:**

1. User shares email in chatbot
2. **Admin gets notification** → `information@codesunny.in`
3. **User gets auto-reply** → Thank you email

**Example Flow:**

```
User: "My name is John and email is john@example.com"
    ↓
System automatically sends:
    ↓
1. To Admin (information@codesunny.in):
   Subject: 🎯 New Lead: John - CodeSunny
   Content: Lead details with reply option
    ↓
2. To User (john@example.com):
   Subject: Thank You for Contacting CodeSunny!
   Content: Acknowledgment + contact info
```

---

## 🎯 Advanced Automation Options

### Option 2: Follow-up Email Sequence

Automatic follow-up emails after X days:

**Day 1:** Thank you email (already done)
**Day 3:** Follow-up if no response
**Day 7:** Final reminder

**Implementation:**

<function_calls>
<invoke name="fsWrite">
<parameter name="path">mcp-server/email_automation.py
Email Automation System
Handles follow-up emails, reminders, and sequences
"""

import os
import json
import smtplib
from email.message import EmailMessage
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv
import time

load_dotenv(Path(**file**).parent / ".env")

LEADS_PATH = Path(**file**).parent / "data" / "leads.json"

def load_leads():
"""Load all leads"""
if not LEADS_PATH.exists():
return []
with open(LEADS_PATH, 'r') as f:
return json.load(f)

def save_leads(leads):
"""Save leads"""
with open(LEADS_PATH, 'w') as f:
json.dump(leads, f, indent=2)

def send_email(to_email, subject, html_content, text_content):
"""Send email using configured SMTP"""
host = os.environ.get("SMTP_HOST")
port = int(os.environ.get("SMTP_PORT", "465"))
user = os.environ.get("SMTP_USER")
password = os.environ.get("SMTP_PASS")
email_from = os.environ.get("SMTP_FROM")

    if not all([host, user, password, email_from]):
        print("❌ SMTP not configured")
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = email_from
    msg["To"] = to_email
    msg["Reply-To"] = email_from
    msg.set_content(text_content)
    msg.add_alternative(html_content, subtype='html')

    try:
        if port == 465:
            with smtplib.SMTP_SSL(host, port) as server:
                server.login(user, password)
                server.send_message(msg)
        else:
            with smtplib.SMTP(host, port) as server:
                server.starttls()
                server.login(user, password)
                server.send_message(msg)
        return True
    except Exception as e:
        print(f"❌ Email error: {e}")
        return False

def send_followup_day3(lead):
"""Send follow-up email after 3 days"""
name = lead.get('name', 'there')
email = lead.get('email', '')

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Following Up on Your Inquiry</h2>

            <p>Hi {name},</p>

            <p>I wanted to follow up on your recent inquiry about our services.</p>

            <p>Have you had a chance to review our offerings? I'd love to discuss how we can help with your project.</p>

            <div style="background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Quick Links:</strong></p>
                <ul>
                    <li>📱 Schedule a call: <a href="https://codesunny.com/book-call">Book Now</a></li>
                    <li>💰 Get instant quote: <a href="https://codesunny.com/quote">Calculate</a></li>
                    <li>🔍 Free SEO audit: <a href="https://codesunny.com/seo-audit">Audit</a></li>
                </ul>
            </div>

            <p>Feel free to reply to this email with any questions!</p>

            <p>Best regards,<br>
            <strong>CodeSunny Team</strong></p>
        </div>
    </body>
    </html>
    """

    text = f"Hi {name},\n\nFollowing up on your inquiry. Let us know if you have any questions!\n\nBest regards,\nCodeSunny Team"

    return send_email(email, "Following Up - CodeSunny", html, text)

def send_followup_day7(lead):
"""Send final reminder after 7 days"""
name = lead.get('name', 'there')
email = lead.get('email', '')

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Last Chance - Special Offer Inside! 🎁</h2>

            <p>Hi {name},</p>

            <p>I noticed you haven't responded yet. Before we close your inquiry, I wanted to share a special offer:</p>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <h3 style="margin: 0; color: white;">🎉 Limited Time Offer</h3>
                <p style="font-size: 24px; margin: 10px 0;"><strong>10% OFF</strong></p>
                <p style="margin: 0;">On your first project with us!</p>
            </div>

            <p>This offer expires in 48 hours. Don't miss out!</p>

            <p><a href="https://codesunny.com/contact" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Claim Your Discount</a></p>

            <p>Questions? Just reply to this email.</p>

            <p>Best regards,<br>
            <strong>CodeSunny Team</strong></p>
        </div>
    </body>
    </html>
    """

    text = f"Hi {name},\n\nSpecial offer: 10% OFF your first project! Expires in 48 hours.\n\nReply to claim.\n\nBest regards,\nCodeSunny Team"

    return send_email(email, "🎁 Special Offer - 10% OFF - CodeSunny", html, text)

def check_and_send_followups():
"""Check leads and send follow-up emails"""
leads = load_leads()
now = datetime.utcnow()

    for lead in leads:
        email = lead.get('email', '')
        if not email:
            continue

        created_at = datetime.fromisoformat(lead.get('created_at', '').replace('Z', '+00:00'))
        days_ago = (now - created_at).days

        # Day 3 follow-up
        if days_ago == 3 and not lead.get('followup_day3_sent'):
            print(f"📧 Sending Day 3 follow-up to {email}")
            if send_followup_day3(lead):
                lead['followup_day3_sent'] = True
                lead['followup_day3_date'] = now.isoformat() + 'Z'

        # Day 7 follow-up
        if days_ago == 7 and not lead.get('followup_day7_sent'):
            print(f"📧 Sending Day 7 follow-up to {email}")
            if send_followup_day7(lead):
                lead['followup_day7_sent'] = True
                lead['followup_day7_date'] = now.isoformat() + 'Z'

    save_leads(leads)

if **name** == "**main**":
print("🤖 Email Automation System")
print("Checking for follow-ups...")
check_and_send_followups()
print("✅ Done!")
