# 🌐 Browser Testing Instructions

## Problem

Backend mein sab kaam kar raha hai, but browser chatbot mein nahi dikh raha.

## Quick Test

### 1. Open Browser Console

```
1. Open http://localhost:5173
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Open chatbot (bottom-right corner)
```

### 2. Test Image Generation

Type in chatbot:

```
Generate an image of a sunset
```

**Check Console for:**

```javascript
Chat API Response: { success: true, images: [...], ... }
Final reply: "🎨 I've generated an image for you!..."
Image data: { images: [...], prompt: "...", style: "..." }
```

### 3. Test SEO Audit

Type in chatbot:

```
SEO audit for https://example.com
```

**Check Console for:**

```javascript
Chat API Response: { url: "...", overall_score: 72, ... }
Final reply: "🔍 SEO Audit Results..."
SEO data: { url: "...", metrics: {...}, ... }
```

## Expected Behavior

### ✅ Image Generation Should Show:

```
┌─────────────────────────────────────┐
│ 🎨 I've generated an image for you! │
│                                     │
│ Style: digital-art                  │
│ Prompt: A serene sunset...          │
│                                     │
│ [IMAGE DISPLAYED HERE]              │
│                                     │
│ 💡 Right-click to save              │
└─────────────────────────────────────┘
```

### ✅ SEO Audit Should Show:

```
┌─────────────────────────────────────┐
│ 🔍 SEO Audit Results                │
│                                     │
│ 📊 Overall Score: 72/100            │
│                                     │
│ [4 COLORED METRIC CARDS]            │
│                                     │
│ 🎯 Top Issues:                      │
│ • Page load time is 4.2s            │
│ • Images not optimized              │
└─────────────────────────────────────┘
```

## If Not Working

### Check 1: Frontend Server Running?

```bash
# Should see Vite dev server
netstat -ano | findstr ":5173"
```

### Check 2: Hot Reload

```
1. Save ChatWidget.jsx file
2. Browser should auto-reload
3. Try again
```

### Check 3: Hard Refresh

```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Check 4: Clear Cache

```
1. F12 (Developer Tools)
2. Right-click refresh button
3. "Empty Cache and Hard Reload"
```

## Debug Commands

### Test Backend Directly:

```bash
node test-all-tools.js
```

### Check Response Format:

```bash
curl -X POST http://localhost:5000/api/mcp/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\": \"Generate an image of sunset\"}"
```

## Common Issues

### Issue 1: "Sorry, I couldn't respond right now"

**Cause:** Frontend not parsing response correctly
**Fix:** Check console logs, response format might be different

### Issue 2: Image not displaying

**Cause:** Base64 data not rendering
**Fix:** Check if `msg.imageData.images[0].base64` exists in console

### Issue 3: SEO cards not showing

**Cause:** `msg.seoData` is undefined
**Fix:** Check if response has `url` and `overall_score` fields

## Next Steps

If still not working, share:

1. Browser console logs
2. Network tab response
3. Screenshot of chatbot
