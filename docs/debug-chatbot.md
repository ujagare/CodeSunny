# 🔍 Chat Bot Debug Guide

## Step 1: Check Kahan Test Kar Rahe Hain

### Local Testing (localhost):

```
URL: http://localhost:5173
Status: ⚠️ Backend connection nahi hoga (expected)
Reason: Environment variables Vercel par set karne hain, local mein nahi
```

### Production Testing:

```
URL: https://codesunny.vercel.app
Status: ✅ Yahan test karna hai
Reason: Production environment variables wahan set hain
```

---

## Step 2: Browser Console Check Karein

### Kaise Check Karein:

1. Production site open karein: https://codesunny.vercel.app
2. **F12** press karein (ya Right Click → Inspect)
3. **Console** tab select karein
4. Chat widget open karein
5. Message send karein
6. Console mein error dekhein

### Common Errors:

#### Error 1: CORS Error

```
Access to fetch at 'https://codesunny-backend.onrender.com/api/mcp/chat'
from origin 'https://codesunny.vercel.app' has been blocked by CORS policy
```

**Solution:**

- Render dashboard → Backend service → Environment
- `CORS_ORIGIN` check karein: `https://codesunny.vercel.app` included hai?
- Backend service restart karein

#### Error 2: Network Error / Failed to Fetch

```
Failed to fetch
TypeError: Failed to fetch
```

**Possible Reasons:**

1. Backend service down hai
2. Environment variable `VITE_API_URL` set nahi hai
3. Backend URL galat hai

**Solution:**

```bash
# Backend check karein
curl https://codesunny-backend.onrender.com/api/health
```

#### Error 3: 404 Not Found

```
GET https://codesunny.vercel.app/api/mcp/chat 404
```

**Reason:** Environment variable set nahi hai
**Solution:** Vercel mein `VITE_API_URL` add karein

---

## Step 3: Vercel Environment Variables Check

### Kaise Check Karein:

1. https://vercel.com/dashboard
2. Project select karein
3. Settings → Environment Variables
4. Check karein ye variables hain ya nahi:
   - `VITE_API_URL`
   - `VITE_APP_ENV`

### Agar Nahi Hain:

```
Add karein:
VITE_API_URL = https://codesunny-backend.onrender.com
VITE_APP_ENV = production

Phir:
Deployments → Latest → Redeploy
```

---

## Step 4: Backend Status Check

### Quick Test:

```bash
curl https://codesunny-backend.onrender.com/api/health
```

**Expected Response:**

```json
{ "status": "ok" }
```

### Agar Response Nahi Aaya:

- Render dashboard open karein
- Backend service check karein
- Status "Live" hona chahiye
- Logs check karein

---

## Step 5: Complete Test Flow

### Test 1: Backend Health

```bash
curl https://codesunny-backend.onrender.com/api/health
```

✅ Should return: `{"status":"ok"}`

### Test 2: Chat Endpoint (with CORS)

```bash
curl -X POST https://codesunny-backend.onrender.com/api/mcp/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://codesunny.vercel.app" \
  -d '{"message":"test"}'
```

✅ Should return: Chat response

### Test 3: Frontend

1. Open: https://codesunny.vercel.app
2. F12 → Console tab
3. Click chat widget
4. Send message
5. Check response

---

## 🚨 Quick Fixes

### Fix 1: Environment Variables Missing

```
Vercel Dashboard → Settings → Environment Variables
Add:
- VITE_API_URL = https://codesunny-backend.onrender.com
- VITE_APP_ENV = production
Then: Redeploy
```

### Fix 2: CORS Error

```
Render Dashboard → Backend Service → Environment
Check:
- CORS_ORIGIN = https://codesunny.vercel.app,https://www.codesunny.com
Then: Manual Deploy
```

### Fix 3: Backend Down

```
Render Dashboard → Backend Service
Check Status: Should be "Live"
If not: Click "Manual Deploy"
```

### Fix 4: Cache Issue

```
Browser:
Ctrl + Shift + Delete
Clear cache
Reload page
```

---

## 📊 Diagnostic Checklist

Run through this checklist:

- [ ] Testing on production URL (not localhost)
- [ ] Vercel environment variables added
- [ ] Vercel redeployed after adding variables
- [ ] Backend service is "Live" on Render
- [ ] Backend health endpoint responds
- [ ] CORS_ORIGIN includes frontend URL
- [ ] Browser cache cleared
- [ ] No errors in browser console

---

## 🆘 Still Not Working?

### Share These Details:

1. **Where are you testing?**

   - URL: ******\_******

2. **Browser Console Error:**

   ```
   [Paste error here]
   ```

3. **Backend Health Check:**

   ```bash
   curl https://codesunny-backend.onrender.com/api/health
   # Response: _____________
   ```

4. **Vercel Environment Variables:**

   - [ ] VITE_API_URL added
   - [ ] VITE_APP_ENV added
   - [ ] Redeployed after adding

5. **Render Backend Status:**
   - Status: ******\_******
   - CORS_ORIGIN value: ******\_******

---

## 💡 Most Common Issue

**90% of the time, the issue is:**

❌ **Environment variables not added in Vercel dashboard**

✅ **Solution:**

1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Add `VITE_API_URL` and `VITE_APP_ENV`
4. Redeploy
5. Wait 2-3 minutes
6. Test again

---

**Need help? Share the browser console error!**
