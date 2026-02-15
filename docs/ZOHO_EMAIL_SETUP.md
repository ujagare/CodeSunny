# ðŸ“§ Zoho Mail Setup Guide - informatio@codesunny.in

## âœ… Current Configuration

Aapka email setup almost ready hai! Bas password add karna hai.

---

## ðŸ”§ Setup Steps

### Step 1: Zoho Password Setup

**Option A: Regular Password (Simple)**

Agar 2FA (Two-Factor Authentication) enabled NAHI hai:

1. Open `mcp-server/.env` file
2. Find this line:
   ```
   SMTP_PASS=YOUR_ZOHO_PASSWORD_HERE
   ```
3. Replace with your actual Zoho password:
   ```
   SMTP_PASS=your_actual_password
   ```

**Option B: App Password (If 2FA Enabled)**

Agar 2FA enabled hai:

1. Login to Zoho Mail: https://mail.zoho.com
2. Click profile icon (top right) â†’ My Account
3. Security â†’ App Passwords
4. Generate new App Password for "Mail"
5. Copy the generated password
6. Update `.env`:
   ```
   SMTP_PASS=generated_app_password
   ```

---

## ðŸ“ Complete Configuration

Aapki `.env` file mein ye configuration honi chahiye:

```env
# SMTP Configuration
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=informatio@codesunny.in
SMTP_PASS=your_password_here
SMTP_FROM=informatio@codesunny.in
LEADS_EMAIL_TO=informatio@codesunny.in
```

---

## ðŸ§ª Test Email Functionality

### Method 1: Using Test Script

Create `test-email.py` in `mcp-server/`:

```python
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

def test_email():
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    email_from = os.environ.get("SMTP_FROM")
    email_to = os.environ.get("LEADS_EMAIL_TO")

    print(f"Testing email with:")
    print(f"  Host: {host}")
    print(f"  Port: {port}")
    print(f"  User: {user}")
    print(f"  From: {email_from}")
    print(f"  To: {email_to}")

    msg = EmailMessage()
    msg["Subject"] = "ðŸ§ª Test Email - CodeSunny Chatbot"
    msg["From"] = email_from
    msg["To"] = email_to
    msg.set_content("This is a test email from CodeSunny chatbot. Email is working! âœ…")

    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
        print("\nâœ… Email sent successfully!")
        return True
    except Exception as e:
        print(f"\nâŒ Email failed: {e}")
        return False

if __name__ == "__main__":
    test_email()
```

Run test:

```bash
cd mcp-server
python test-email.py
```

### Method 2: Using Chatbot

1. Start MCP server: `cd mcp-server && python server.py`
2. Start backend: `cd backend && npm start`
3. Start frontend: `npm run dev`
4. Open chatbot
5. Send message with email:
   ```
   My name is Test User and email is test@example.com
   ```
6. Check `informatio@codesunny.in` inbox for lead notification

---

## ðŸ” Troubleshooting

### Error: "Authentication failed"

**Solution:**

- Check password is correct
- If 2FA enabled, use App Password
- Verify email: `informatio@codesunny.in` exists in Zoho

### Error: "Connection refused"

**Solution:**

- Check SMTP settings:
  ```
  SMTP_HOST=smtp.zoho.com
  SMTP_PORT=587
  ```
- Ensure internet connection is working

### Error: "Sender address rejected"

**Solution:**

- Verify `SMTP_USER` and `SMTP_FROM` are same:
  ```
  SMTP_USER=informatio@codesunny.in
  SMTP_FROM=informatio@codesunny.in
  ```

### No email received?

**Check:**

1. Spam folder in `informatio@codesunny.in`
2. Zoho Mail quota (not full)
3. MCP server logs for errors
4. Email is actually sent (check server logs)

---

## ðŸ“Š Email Features

### What Emails Are Sent?

1. **Lead Capture Notification**

   - When: User shares email in chatbot
   - To: `informatio@codesunny.in`
   - Contains: Name, Email, Message, Timestamp

2. **Email Format:**

   ```
   Subject: ðŸŽ¯ New Lead: [Name] - CodeSunny

   ðŸŽ¯ New Lead from CodeSunny Website

   ðŸ‘¤ Name: John Doe
   ðŸ“§ Email: john@example.com
   ðŸ“… Date: 2026-02-18

   ðŸ’¬ Message:
   I need an ecommerce website

   Reply directly to contact the lead.
   ```

---

## ðŸ” Security Best Practices

### 1. Don't Commit Password

Add to `.gitignore`:

```
mcp-server/.env
backend/.env
```

### 2. Use App Password

If 2FA enabled, always use App Password instead of main password.

### 3. Rotate Passwords

Change password every 3-6 months.

---

## ðŸ“ˆ Email Logs

Check email sending status in MCP server logs:

```bash
cd mcp-server
python server.py

# Look for:
# âœ… Email sent successfully
# âŒ Email send error: [error message]
```

---

## ðŸŽ¯ Quick Checklist

- [ ] Zoho Mail account active
- [ ] `informatio@codesunny.in` email exists
- [ ] Password added to `.env` file
- [ ] If 2FA enabled, App Password generated
- [ ] Test email sent successfully
- [ ] Lead notification received

---

## ðŸ“ž Need Help?

### Common Issues:

1. **"Invalid credentials"**

   - Double-check password
   - Try App Password if 2FA enabled

2. **"Email not received"**

   - Check spam folder
   - Verify `LEADS_EMAIL_TO` is correct

3. **"Connection timeout"**
   - Check internet connection
   - Verify SMTP settings

---

## âœ… Final Configuration

Your final `mcp-server/.env` should look like:

```env
# Groq API
GROQ_API_KEY=<GROQ_API_KEY>
GROQ_MODEL=llama-3.3-70b-versatile

# Freepik API
FREEPIK_API_KEY=FPSXfa680d64229aa63340333275d1d39e3e
FREEPIK_API_URL=https://api.freepik.com/v1/ai/text-to-image

# Server
PORT=8001

# SMTP Configuration (Zoho Mail)
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=informatio@codesunny.in
SMTP_PASS=your_actual_password_here
SMTP_FROM=informatio@codesunny.in
LEADS_EMAIL_TO=informatio@codesunny.in
```

---

## ðŸš€ Ready to Go!

Once password is added:

1. Restart MCP server
2. Test with chatbot
3. Check email inbox
4. âœ… Email working!

---

**Status:** â³ Waiting for password
**Next Step:** Add Zoho password to `.env` file
**Test:** Send test lead through chatbot


