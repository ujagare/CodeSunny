"""
WhatsApp Business Automation
Supports: Auto-replies, Broadcasts, Quote generation
Note: Requires WhatsApp Business API or Twilio integration
"""

import os
import json
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False

from gemini_compat import GEMINI_AVAILABLE, create_gemini_model

load_dotenv(Path(__file__).parent / ".env")

# Data storage
DATA_DIR = Path(__file__).parent / "data"
WHATSAPP_LOG = DATA_DIR / "whatsapp_messages.json"
CONTACTS_FILE = DATA_DIR / "whatsapp_contacts.json"

# AI clients
groq_client = None
gemini_client = None

if GROQ_AVAILABLE and os.environ.get("GROQ_API_KEY"):
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
if GEMINI_AVAILABLE and os.environ.get("GEMINI_API_KEY"):
    gemini_client = create_gemini_model(
        os.environ.get("GEMINI_API_KEY"),
        os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    )


def ensure_data_files():
    """Create data files if not exist"""
    DATA_DIR.mkdir(exist_ok=True)
    if not WHATSAPP_LOG.exists():
        WHATSAPP_LOG.write_text("[]", encoding="utf-8")
    if not CONTACTS_FILE.exists():
        CONTACTS_FILE.write_text("[]", encoding="utf-8")


def load_contacts():
    """Load WhatsApp contacts"""
    ensure_data_files()
    return json.loads(CONTACTS_FILE.read_text(encoding="utf-8"))


def save_contact(phone, name, tags=None):
    """Save contact"""
    contacts = load_contacts()
    
    # Check if exists
    for contact in contacts:
        if contact["phone"] == phone:
            contact["name"] = name
            contact["tags"] = tags or []
            contact["updated_at"] = datetime.now(timezone.utc).isoformat() + "Z"
            CONTACTS_FILE.write_text(json.dumps(contacts, indent=2), encoding="utf-8")
            return
    
    # Add new
    contacts.append({
        "phone": phone,
        "name": name,
        "tags": tags or [],
        "created_at": datetime.now(timezone.utc).isoformat() + "Z"
    })
    CONTACTS_FILE.write_text(json.dumps(contacts, indent=2), encoding="utf-8")


def generate_auto_reply(message):
    """Generate AI-powered auto-reply"""
    prompt = f"""
You are CodeSunny's WhatsApp assistant.

Customer message: {message}

Generate a helpful, professional reply (max 150 words).
Include:
- Acknowledge their message
- Provide relevant information
- Offer next steps
- Add contact: information@codesunny.in or +91 89758075789

Return only the reply text.
""".strip()

    try:
        if groq_client:
            resp = groq_client.chat.completions.create(
                model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
                temperature=0.6,
                max_tokens=200,
                messages=[
                    {"role": "system", "content": "You are a helpful WhatsApp assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            return resp.choices[0].message.content.strip()
        elif gemini_client:
            resp = gemini_client.generate_content(prompt)
            return resp.text.strip()
        else:
            return "Thank you for your message! Our team will get back to you shortly. For urgent queries, call +91 89758075789 or email information@codesunny.in"
    except Exception as e:
        print(f"❌ AI reply failed: {e}")
        return "Thank you for contacting CodeSunny! We'll respond soon. Call: +91 89758075789"


def send_whatsapp_message(phone, message):
    """
    Send WhatsApp message
    Note: Requires Twilio or WhatsApp Business API
    """
    # Check for Twilio credentials
    twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID", "")
    twilio_token = os.environ.get("TWILIO_AUTH_TOKEN", "")
    twilio_from = os.environ.get("TWILIO_WHATSAPP_FROM", "")
    
    if twilio_sid and twilio_token and twilio_from:
        try:
            from twilio.rest import Client
            client = Client(twilio_sid, twilio_token)
            
            msg = client.messages.create(
                from_=f"whatsapp:{twilio_from}",
                body=message,
                to=f"whatsapp:{phone}"
            )
            
            log_message(phone, message, "sent", msg.sid)
            print(f"✅ Sent to {phone}")
            return True
        except Exception as e:
            print(f"❌ Twilio error: {e}")
            return False
    
    # Fallback: Log message for manual sending
    log_message(phone, message, "pending_manual")
    print(f"📝 Message logged for {phone}")
    print(f"💬 Message: {message[:100]}...")
    return True


def log_message(phone, message, status, msg_id=None):
    """Log WhatsApp message"""
    ensure_data_files()
    messages = json.loads(WHATSAPP_LOG.read_text(encoding="utf-8"))
    
    messages.append({
        "phone": phone,
        "message": message,
        "status": status,
        "message_id": msg_id,
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
    })
    
    WHATSAPP_LOG.write_text(json.dumps(messages, indent=2), encoding="utf-8")


def broadcast_message(message, contact_tags=None):
    """Send broadcast to multiple contacts"""
    contacts = load_contacts()
    
    # Filter by tags if specified
    if contact_tags:
        contacts = [c for c in contacts if any(tag in c.get("tags", []) for tag in contact_tags)]
    
    print(f"\n📢 Broadcasting to {len(contacts)} contacts...")
    
    sent = 0
    for contact in contacts:
        phone = contact["phone"]
        name = contact.get("name", "there")
        
        # Personalize message
        personalized = message.replace("{name}", name)
        
        if send_whatsapp_message(phone, personalized):
            sent += 1
        
        # Rate limiting
        import time
        time.sleep(1)
    
    print(f"\n✅ Broadcast complete: {sent}/{len(contacts)} sent")
    return sent


def generate_quote_message(services):
    """Generate quote message for WhatsApp"""
    service_list = services.split(",") if isinstance(services, str) else services
    
    # Simple pricing (you can make this more sophisticated)
    prices = {
        "web": "₹25,000 - ₹1,00,000",
        "ecommerce": "₹50,000 - ₹2,00,000",
        "seo": "₹15,000 - ₹50,000/month",
        "design": "₹10,000 - ₹50,000",
        "marketing": "₹20,000 - ₹1,00,000/month",
        "ai": "₹30,000 - ₹1,50,000"
    }
    
    quote_text = "🎯 *CodeSunny Quote*\n\n"
    
    for service in service_list:
        service_lower = service.lower().strip()
        for key, price in prices.items():
            if key in service_lower:
                quote_text += f"✅ {service}: {price}\n"
                break
    
    quote_text += "\n📞 *Next Steps:*\n"
    quote_text += "1. Share your requirements\n"
    quote_text += "2. Get detailed proposal\n"
    quote_text += "3. Start your project\n\n"
    quote_text += "📧 information@codesunny.in\n"
    quote_text += "📱 +91 89758075789\n"
    quote_text += "🌐 codesunny.in"
    
    return quote_text


def setup_auto_reply(enable=True):
    """Setup auto-reply configuration"""
    config = {
        "enabled": enable,
        "business_hours": {
            "start": "09:00",
            "end": "18:00",
            "timezone": "Asia/Kolkata"
        },
        "after_hours_message": "Thank you for your message! Our business hours are 9 AM - 6 PM IST. We'll respond when we're back. For urgent queries: information@codesunny.in",
        "updated_at": datetime.now(timezone.utc).isoformat() + "Z"
    }
    
    config_file = DATA_DIR / "whatsapp_config.json"
    config_file.write_text(json.dumps(config, indent=2), encoding="utf-8")
    
    status = "enabled" if enable else "disabled"
    print(f"✅ Auto-reply {status}")


if __name__ == "__main__":
    import sys
    
    print("\n💬 WhatsApp Business Automation")
    print("=" * 60)
    
    if len(sys.argv) < 2:
        print("\nUsage:")
        print("  python whatsapp_automation.py send <phone> <message>")
        print("  python whatsapp_automation.py broadcast <message> [tags]")
        print("  python whatsapp_automation.py quote <phone> <services>")
        print("  python whatsapp_automation.py auto-reply <enable|disable>")
        print("  python whatsapp_automation.py add-contact <phone> <name> [tags]")
        print("\nExamples:")
        print('  python whatsapp_automation.py send +919876543210 "Hello!"')
        print('  python whatsapp_automation.py broadcast "New offer!" hot-leads')
        print('  python whatsapp_automation.py quote +919876543210 "web,seo"')
        print('  python whatsapp_automation.py auto-reply enable')
        print('  python whatsapp_automation.py add-contact +919876543210 "John" hot-lead')
        sys.exit(0)
    
    command = sys.argv[1].lower()
    
    if command == "send":
        if len(sys.argv) < 4:
            print("❌ Phone and message required")
            sys.exit(1)
        phone = sys.argv[2]
        message = " ".join(sys.argv[3:])
        send_whatsapp_message(phone, message)
    
    elif command == "broadcast":
        if len(sys.argv) < 3:
            print("❌ Message required")
            sys.exit(1)
        message = sys.argv[2]
        tags = sys.argv[3:] if len(sys.argv) > 3 else None
        broadcast_message(message, tags)
    
    elif command == "quote":
        if len(sys.argv) < 4:
            print("❌ Phone and services required")
            sys.exit(1)
        phone = sys.argv[2]
        services = sys.argv[3]
        quote_msg = generate_quote_message(services)
        send_whatsapp_message(phone, quote_msg)
    
    elif command == "auto-reply":
        enable = sys.argv[2].lower() == "enable" if len(sys.argv) > 2 else True
        setup_auto_reply(enable)
    
    elif command == "add-contact":
        if len(sys.argv) < 4:
            print("❌ Phone and name required")
            sys.exit(1)
        phone = sys.argv[2]
        name = sys.argv[3]
        tags = sys.argv[4:] if len(sys.argv) > 4 else []
        save_contact(phone, name, tags)
        print(f"✅ Contact saved: {name} ({phone})")
    
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)
    
    print("\n✅ Done!\n")
