# 🎨 Image Generation Test Commands

## Browser Chatbot mein ye messages type karein:

### Test 1: Simple Image

```
Generate an image of a sunset
```

### Test 2: Professional Image

```
Create a professional business background
```

### Test 3: Website Hero

```
Make a hero image for my website
```

### Test 4: E-commerce

```
Generate an image for my e-commerce store
```

### Test 5: Tech Startup

```
Show me a design for a tech startup office
```

---

## ✅ Expected Result:

1. **Message send hone ke baad:**

   - Loading dots dikhenge (3 bouncing dots)
   - 5-10 seconds wait karein

2. **Image generate hone ke baad:**

   ```
   🎨 I've generated an image for you!

   Style: digital-art
   Prompt: [Enhanced prompt by AI]

   [IMAGE DISPLAYED HERE]

   💡 Right-click to save or download the image
   ```

3. **Image display:**
   - Full image chatbot mein dikhega
   - Right-click karke save kar sakte hain
   - High quality (1024x1024)

---

## 🐛 Agar Image Nahi Aa Rahi:

### Check 1: Backend Logs

Terminal mein dekho kya error aa raha hai:

```
Freepik API Response:
  Status: 200
  [Image data should be here]
```

### Check 2: API Key

```bash
# Check if Freepik API key is valid
cd mcp-server
cat .env | findstr FREEPIK
```

Should show:

```
FREEPIK_API_KEY=FPSXfa680d64229aa63340333275d1d39e3e
```

### Check 3: Test via Script

```bash
node demo-live.js
```

Should show:

```
✅ Image Created Successfully!
   Style: digital-art
   Size: 1024x1024
   Image Data: Base64 (xxxxx chars)
```

---

## 📊 Image Generation Flow:

```
User: "Generate an image of sunset"
  ↓
Frontend (ChatWidget.jsx)
  ↓
Backend (/api/mcp/chat)
  ↓
MCP Server (chat tool)
  ↓
Detects "generate image" keywords
  ↓
Calls generate_image tool
  ↓
Groq AI enhances prompt
  ↓
Freepik API generates image
  ↓
Returns Base64 image
  ↓
Backend unwraps response
  ↓
Frontend displays image
```

---

## 💡 Pro Tips:

1. **Better Prompts = Better Images**

   - ❌ "image"
   - ✅ "professional modern website hero image with gradient"

2. **Specific Styles**

   - "realistic sunset photo"
   - "digital art tech background"
   - "illustration of office space"

3. **Save Images**
   - Right-click on image
   - "Save image as..."
   - Or "Copy image"

---

## 🎯 Keywords that Trigger Image Generation:

- "generate image"
- "create image"
- "make image"
- "generate picture"
- "create picture"
- "show me image"
- "show me design"
- "generate hero image"
- "make professional"

---

## ⏱️ Timing:

- **Fast**: 5-7 seconds
- **Normal**: 8-10 seconds
- **Slow**: 10-15 seconds (if API is busy)

If taking more than 20 seconds, check:

1. Internet connection
2. Freepik API status
3. Backend logs for errors

---

**Ready to test? Open chatbot and try any command above!** 🚀
