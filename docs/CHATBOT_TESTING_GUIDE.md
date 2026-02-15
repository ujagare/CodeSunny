# 🧪 Chat Bot Testing Guide

## 🎯 Complete Testing Checklist

### Pre-Testing Setup

**1. Start All Services:**

```bash
# Option 1: Use start-all.bat
start-all.bat

# Option 2: Manual start
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: MCP Server
cd mcp-server
python server.py
```

**2. Verify Services Running:**

- ✅ Frontend: http://localhost:5173
- ✅ Backend: http://localhost:5000
- ✅ MCP Server: http://localhost:8001

---

## 🌐 Browser Testing (Primary Method)

### Test 1: Chat Widget Opens

1. Open: http://localhost:5173
2. Look for chat button (bottom-right)
3. Click "Chat with AI" button
4. ✅ Widget should open with welcome message

### Test 2: Send Messages

**Test Messages:**

```
1. "Hello"
   Expected: Greeting response

2. "What services do you offer?"
   Expected: List of services

3. "Tell me about web development"
   Expected: Detailed info about web dev

4. "I need pricing for e-commerce"
   Expected: Suggest contact form

5. "How long does a project take?"
   Expected: General timeline info
```

### Test 3: Search Tab

1. Click "Search" tab
2. Enter: "SEO"
3. Click "Search" button
4. ✅ Should show relevant pages

### Test 4: Lead Form

1. Click "Contact" tab
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: "Test message"
3. Click "Submit Lead"
4. ✅ Should show success message

### Test 5: Browser Console Check

1. Press F12 (Developer Tools)
2. Go to Console tab
3. Send a chat message
4. Check for:
   - ✅ No red errors
   - ✅ API calls successful (200 status)
   - ✅ Responses logged

---

## 🔧 API Testing (Command Line)

### Test 1: Backend Health

```bash
curl http://localhost:5000/api/health
```

**Expected:**

```json
{ "status": "ok" }
```

### Test 2: MCP Server Health

```bash
curl http://localhost:8001/health
```

**Expected:**

```json
{ "status": "ok" }
```

### Test 3: Chat Endpoint

```bash
curl -X POST http://localhost:5000/api/mcp/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"What services do you offer?\"}"
```

**Expected:**

```json
{
  "reply": "We offer web development, UI/UX design..."
}
```

### Test 4: Search Endpoint

```bash
curl -X POST http://localhost:5000/api/mcp/search ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"web development\"}"
```

**Expected:**

```json
{
  "results": [
    {
      "id": "...",
      "title": "Web Development",
      "url": "/services/web-development"
    }
  ]
}
```

### Test 5: Lead Capture

```bash
curl -X POST http://localhost:5000/api/mcp/lead ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"Test\"}"
```

**Expected:**

```json
{
  "status": "received",
  "name": "Test User",
  "email": "test@example.com"
}
```

---

## 🐛 Troubleshooting

### Problem 1: Chat Widget Not Opening

**Check:**

- Frontend running? (http://localhost:5173)
- Browser console errors?
- ChatWidget.jsx loaded?

**Solution:**

```bash
# Restart frontend
npm run dev
```

### Problem 2: No Response from Chat

**Check:**

- Backend running? (http://localhost:5000)
- MCP server running? (http://localhost:8001)
- Browser console for errors

**Solution:**

```bash
# Test backend directly
curl http://localhost:5000/api/health

# Test MCP server
curl http://localhost:8001/health
```

### Problem 3: "temporarily unavailable" Message

**Check:**

- MCP server logs
- Backend logs
- API connection

**Solution:**

```bash
# Check MCP server terminal for errors
# Restart MCP server
cd mcp-server
python server.py
```

### Problem 4: Search Not Working

**Check:**

- `site_index.json` exists?
- MCP server search function working?

**Solution:**

```bash
# Test search directly
curl -X POST http://localhost:5000/api/mcp/search ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"test\"}"
```

### Problem 5: Lead Form Not Submitting

**Check:**

- Email configuration in `.env`?
- SMTP settings correct?

**Solution:**

```bash
# Check mcp-server/.env
# SMTP settings should be configured
# Or check mcp-server/data/leads.json for saved leads
```

---

## 📊 Testing Scenarios

### Scenario 1: New Visitor

```
User: "Hi"
Bot: Welcome message
User: "What do you do?"
Bot: Services overview
User: "Tell me more about web development"
Bot: Detailed web dev info
```

### Scenario 2: Service Inquiry

```
User: "I need a website"
Bot: Questions about requirements
User: "E-commerce site"
Bot: E-commerce info
User: "How much does it cost?"
Bot: Suggests contact form
```

### Scenario 3: Technical Questions

```
User: "What technologies do you use?"
Bot: Tech stack info
User: "Do you use React?"
Bot: Yes, detailed React info
User: "What about backend?"
Bot: Backend technologies
```

### Scenario 4: Lead Capture

```
User: "I want to start a project"
Bot: Suggests contact form
User: Fills form
Bot: Confirmation message
```

---

## ✅ Success Criteria

### Chat Functionality

- ✅ Widget opens/closes smoothly
- ✅ Messages send successfully
- ✅ Responses appear within 2-3 seconds
- ✅ No console errors
- ✅ Conversation flows naturally

### Search Functionality

- ✅ Search returns relevant results
- ✅ Results are clickable
- ✅ No errors on empty search

### Lead Capture

- ✅ Form validates input
- ✅ Submission successful
- ✅ Confirmation message shown
- ✅ Lead saved to database

### Performance

- ✅ Response time < 3 seconds
- ✅ No memory leaks
- ✅ Smooth animations
- ✅ Mobile responsive

---

## 📝 Test Results Template

```
Date: __________
Tester: __________

Frontend Status: ✅ / ❌
Backend Status: ✅ / ❌
MCP Server Status: ✅ / ❌

Chat Widget:
- Opens: ✅ / ❌
- Sends messages: ✅ / ❌
- Receives responses: ✅ / ❌
- Response time: _____ seconds

Search:
- Returns results: ✅ / ❌
- Results accurate: ✅ / ❌

Lead Form:
- Validates input: ✅ / ❌
- Submits successfully: ✅ / ❌
- Shows confirmation: ✅ / ❌

Issues Found:
1. _______________
2. _______________

Notes:
_______________
```

---

## 🎯 Quick Test Commands

**All-in-One Test Script:**

```bash
# Test all endpoints
echo "Testing Backend Health..."
curl http://localhost:5000/api/health

echo "\nTesting MCP Health..."
curl http://localhost:8001/health

echo "\nTesting Chat..."
curl -X POST http://localhost:5000/api/mcp/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Hello\"}"

echo "\nTesting Search..."
curl -X POST http://localhost:5000/api/mcp/search ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"web\"}"

echo "\nAll tests complete!"
```

---

## 💡 Pro Tips

1. **Use Browser DevTools:**

   - Network tab to see API calls
   - Console tab for errors
   - Application tab for storage

2. **Test Different Scenarios:**

   - New user
   - Returning user
   - Different questions
   - Edge cases

3. **Check Logs:**

   - Frontend console
   - Backend terminal
   - MCP server terminal

4. **Test Mobile:**

   - Open DevTools
   - Toggle device toolbar
   - Test on actual mobile device

5. **Performance Testing:**
   - Send multiple messages quickly
   - Check response times
   - Monitor memory usage

---

**Happy Testing! 🚀**
