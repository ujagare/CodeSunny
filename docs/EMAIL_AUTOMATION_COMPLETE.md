# 📧 Email Automation - Complete Guide

## ✅ What's Implemented

### 1. Auto-Reply to Leads (Already Working)

When user shares email in chatbot:

- ✅ Admin gets notification at `information@codesunny.in`
- ✅ User gets automatic "Thank You" email
- ✅ Both emails are HTML formatted

### 2. Follow-Up Email System (New)

Automatic follow-up emails after lead capture:

- Day 3: Gentle reminder
- Day 7: Special offer (10% discount)

---

## 🚀 How It Works

### Current Flow:

```
User shares email in chatbot
    ↓
Lead saved to database
    ↓
2 Emails sent automatically:
    1. Admin notification → information@codesunny.in
    2. Auto-reply → User's email
    ↓
Follow-up system (optional):
    Day 3 → Reminder email
    Day 7 → Special offer email
```

---

## 📝 Email Templates

### 1. Auto-Reply (Immediate)

**To:** User's email  
**Subject:** Thank You for Contacting CodeSunny!

**Content:**

- Thank you message
- Confirmation of receipt
- Contact information
- Links to services

### 2. Day 3 Follow-Up

**To:** User's email  
**Subject:** Following Up - CodeSunny

**Content:**

- Gentle reminder
- Quick links (book call, quote, SEO audit)
- Call to action

### 3. Day 7 Final Reminder

**To:** User's email  
**Subject:** 🎁 Special Offer - 10% OFF - CodeSunny

**Content:**

- Special discount offer (10% OFF)
- Urgency (48 hours)
- Strong call to action

---

## 🔧 Setup Follow-Up Automation

### Option 1: Manual Run (Simple)

Run script manually to send follow-ups:

```bash
cd mcp-server
python email_automation.py
```

**When to run:**

- Once daily (morning)
- After checking leads
- Before important campaigns

### Option 2: Cron Job (Automated)

**Windows (Task Scheduler):**

1. Open Task Scheduler
2. Create Basic Task
3. Name: "CodeSunny Email Automation"
4. Trigger: Daily at 9:00 AM
5. Action: Start a program
   - Program: `python`
   - Arguments: `C:\path\to\mcp-server\email_automation.py`
   - Start in: `C:\path\to\mcp-server`

**Linux/Mac (Crontab):**

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at 9 AM)
0 9 * * * cd /path/to/mcp-server && python email_automation.py
```

### Option 3: N8N Workflow (Advanced)

Use N8N for visual automation:

1. Schedule Trigger (daily)
2. HTTP Request to run script
3. Conditional logic
4. Email sending
5. Database updates

---

## 📊 Email Automation Features

### Current Features:

1. **Instant Auto-Reply** ✅

   - Sent immediately when lead captured
   - Professional HTML template
   - Contact information included

2. **Admin Notification** ✅

   - Sent to information@codesunny.in
   - Lead details included
   - Direct reply option

3. **Follow-Up Sequence** ✅
   - Day 3: Gentle reminder
   - Day 7: Special offer
   - Automatic tracking (no duplicates)

### Tracking:

Each lead has flags:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-02-18T10:00:00Z",
  "followup_day3_sent": true,
  "followup_day3_date": "2026-02-21T09:00:00Z",
  "followup_day7_sent": false
}
```

---

## 🎯 Customization

### Change Follow-Up Days:

Edit `mcp-server/email_automation.py`:

```python
# Day 3 follow-up
if days_ago == 3 and not lead.get('followup_day3_sent'):
    # Change 3 to any number of days

# Day 7 follow-up
if days_ago == 7 and not lead.get('followup_day7_sent'):
    # Change 7 to any number of days
```

### Add More Follow-Ups:

```python
# Day 14 follow-up
if days_ago == 14 and not lead.get('followup_day14_sent'):
    print(f"📧 Sending Day 14 follow-up to {email}")
    if send_followup_day14(lead):
        lead['followup_day14_sent'] = True
        lead['followup_day14_date'] = now.isoformat() + 'Z'
```

### Customize Email Templates:

Edit HTML in `send_followup_day3()` or `send_followup_day7()` functions.

---

## 📈 Advanced Automation Options

### Option 1: Drip Campaign

Sequential emails over time:

- Day 0: Welcome email
- Day 3: Feature highlight
- Day 7: Case study
- Day 14: Special offer
- Day 30: Final reminder

### Option 2: Behavior-Based

Send emails based on actions:

- User clicked link → Send detailed info
- User visited pricing → Send discount
- User abandoned quote → Send reminder

### Option 3: Segmentation

Different emails for different leads:

- E-commerce leads → E-commerce case studies
- SEO leads → SEO success stories
- Design leads → Portfolio showcase

### Option 4: A/B Testing

Test different subject lines:

- Version A: "Following Up"
- Version B: "Quick Question"
- Track which gets more responses

---

## 🔒 Best Practices

### 1. Frequency

- Don't spam (max 1 email per 3 days)
- Respect unsubscribe requests
- Monitor bounce rates

### 2. Content

- Personalize with name
- Provide value (not just selling)
- Clear call to action
- Mobile-friendly design

### 3. Timing

- Send during business hours
- Avoid weekends (unless B2C)
- Test different times

### 4. Tracking

- Monitor open rates
- Track click-through rates
- Measure conversions
- Adjust based on data

---

## 📊 Monitoring

### Check Email Logs:

```bash
# Run automation with verbose output
python mcp-server/email_automation.py
```

### Check Lead Status:

```bash
# View leads file
cat mcp-server/data/leads.json
```

### Email Metrics:

Track in Zoho Mail:

- Sent emails
- Delivery rate
- Bounce rate
- Response rate

---

## 🐛 Troubleshooting

### Emails Not Sending?

1. Check SMTP configuration:

   ```bash
   python mcp-server/test-email.py
   ```

2. Check leads file exists:

   ```bash
   ls mcp-server/data/leads.json
   ```

3. Check email automation script:
   ```bash
   python mcp-server/email_automation.py
   ```

### Duplicate Emails?

- Check `followup_day3_sent` flag in leads.json
- Ensure script runs only once per day

### Wrong Timing?

- Check lead `created_at` timestamp
- Verify days calculation logic

---

## 🎯 Quick Start

### 1. Test Auto-Reply (Already Working)

```bash
# Open chatbot
# Type: "My name is Test and email is test@example.com"
# Check both inboxes
```

### 2. Setup Follow-Ups

```bash
# Run manually
cd mcp-server
python email_automation.py
```

### 3. Automate (Optional)

```bash
# Windows: Task Scheduler
# Linux/Mac: Crontab
# Or: Use N8N workflow
```

---

## 📚 Files

### Core Files:

- `mcp-server/server.py` - Auto-reply logic (updated)
- `mcp-server/email_automation.py` - Follow-up system (new)
- `mcp-server/data/leads.json` - Lead storage

### Configuration:

- `mcp-server/.env` - SMTP settings

### Documentation:

- `docs/EMAIL_AUTOMATION_COMPLETE.md` - This file

---

## ✅ Summary

### What's Working:

1. ✅ Instant auto-reply to leads
2. ✅ Admin notifications
3. ✅ HTML formatted emails
4. ✅ Follow-up system ready

### What to Do:

1. Test auto-reply (already working)
2. Run follow-up script manually
3. Setup automation (cron/task scheduler)
4. Monitor and adjust

### Result:

- Professional email communication
- Automated lead nurturing
- Higher conversion rates
- Less manual work

---

**Status:** ✅ Email Automation Complete

**Auto-Reply:** Working  
**Follow-Ups:** Ready (manual or automated)  
**Customization:** Easy

🚀 **Ready to convert more leads!**
