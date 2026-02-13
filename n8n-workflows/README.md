# CodeSunny N8N Workflows

## 📦 Included Workflows

### 1. Lead Notification Workflow

**File:** `1-lead-notification-workflow.json`

**Features:**

- ✅ Receives leads from chatbot via webhook
- ✅ Validates email and name
- ✅ Sends email notification to you
- ✅ Saves lead to Google Sheets
- ✅ Sends auto-reply to client

**Setup:**

1. Import workflow in N8N
2. Configure Gmail SMTP credentials
3. Create Google Sheet with columns: Name, Email, Message, Date, Status
4. Update `YOUR_GOOGLE_SHEET_ID` in workflow
5. Copy webhook URL and update in your backend

---

### 2. Slack Notification Workflow

**File:** `2-slack-notification-workflow.json`

**Features:**

- ✅ Sends formatted Slack message with lead details
- ✅ Includes action buttons (Email, View Sheet)
- ✅ Real-time notifications

**Setup:**

1. Create Slack App and get API token
2. Add bot to your channel
3. Configure Slack credentials in N8N
4. Update `YOUR_CHANNEL_ID`

---

### 3. Lead Scoring & Routing Workflow

**File:** `3-lead-scoring-workflow.json`

**Features:**

- ✅ AI-powered lead scoring (0-100)
- ✅ Automatic priority assignment (High/Medium/Low)
- ✅ Smart routing based on score
- ✅ High priority leads get immediate alerts
- ✅ All leads saved to Google Sheets

**Scoring Logic:**

- Message length: +15-30 points
- Keywords (enterprise, urgent, budget): +10 each
- Business email: +20 points
- Personal email: +5 points

**Setup:**

1. Import workflow
2. Configure email credentials
3. Update Google Sheets ID
4. Customize scoring logic if needed

---

## 🚀 Quick Start

### Step 1: Install N8N

```bash
npm install -g n8n
n8n start
```

### Step 2: Import Workflows

1. Open N8N (http://localhost:5678)
2. Click "Workflows" → "Import from File"
3. Select workflow JSON file
4. Click "Import"

### Step 3: Configure Credentials

#### Gmail SMTP:

- Host: smtp.gmail.com
- Port: 587
- User: your-email@gmail.com
- Password: App Password (not regular password)

#### Google Sheets:

- Use OAuth2 authentication
- Grant access to Google Sheets API

#### Slack (Optional):

- Create Slack App
- Get Bot Token
- Add to channel

### Step 4: Activate Workflows

1. Click "Active" toggle on each workflow
2. Copy webhook URLs
3. Update in your backend

---

## 🔗 Connect to Your Chatbot

Update your backend to send leads to N8N webhook:

```javascript
// backend/src/routes/mcp.routes.js

router.post("/lead", async (req, res) => {
  const { name, email, message } = req.body;

  // Save to database (existing code)
  const out = await callTool("create_lead", { name, email, message });

  // Send to N8N workflow
  try {
    await fetch("YOUR_N8N_WEBHOOK_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        created_at: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error("N8N webhook error:", err);
  }

  return res.json(out);
});
```

---

## 📊 Google Sheets Template

Create a sheet with these columns:

- Name
- Email
- Message
- Date
- Status
- Score (for workflow 3)
- Priority (for workflow 3)

---

## 🎯 Best Practices

1. **Test First:** Use N8N's test mode before activating
2. **Monitor:** Check N8N execution logs regularly
3. **Backup:** Export workflows periodically
4. **Security:** Use environment variables for sensitive data
5. **Rate Limits:** Be aware of email/API rate limits

---

## 🔧 Customization Ideas

- Add WhatsApp notifications via Twilio
- Integrate with CRM (HubSpot, Pipedrive)
- Send to Discord instead of Slack
- Add to Airtable database
- Trigger Zapier workflows
- Send SMS for high-priority leads

---

## 📞 Support

For issues or questions:

- N8N Docs: https://docs.n8n.io
- Community: https://community.n8n.io
- CodeSunny: your-email@codesunny.com

---

**Made with ❤️ by CodeSunny**
