# ⚡ Quick Deploy Guide

## 🎯 TL;DR - Deploy in 5 Minutes

### Step 1: Environment Variables (2 min)

**Frontend - Vercel Dashboard:**

```
VITE_API_URL = https://codesunny-backend.onrender.com
VITE_APP_ENV = production
```

**Backend - Render/Railway Dashboard:**

```
NODE_ENV = production
PORT = 5000
USE_VITE_DEV_SERVER = false
CORS_ORIGIN = https://codesunny.vercel.app,https://www.codesunny.com
APP_URL = https://codesunny-backend.onrender.com
MCP_URL = https://codesunny-mcp.onrender.com/mcp
MONGO_URI = [your-mongodb-uri]
JWT_SECRET = [your-secret]
JWT_REFRESH_SECRET = [your-refresh-secret]
JWT_EXPIRE = 7d
JWT_REFRESH_EXPIRE = 30d
REQUIRE_EMAIL_VERIFICATION = true
EMAIL_FROM = no-reply@codesunny.com
LOG_LEVEL = info
```

### Step 2: Deploy (2 min)

```bash
# Push to GitHub
git add .
git commit -m "Production deployment"
git push origin main

# Vercel and Render will auto-deploy
```

### Step 3: Test (1 min)

```bash
# Run automated tests
npm run test:prod

# Or manual test
curl https://codesunny-backend.onrender.com/api/health
```

## 🔧 Platform-Specific Commands

### Vercel (Frontend)

```bash
# Manual deploy
vercel --prod

# Check deployment
vercel ls
```

### Render (Backend)

- Auto-deploys on Git push
- View logs in dashboard
- Manual deploy: Click "Manual Deploy" button

### Railway (Backend Alternative)

```bash
railway up
railway logs
```

### Heroku (Backend Alternative)

```bash
git push heroku main
heroku logs --tail
```

## ✅ Quick Test Commands

```bash
# Health check
curl https://codesunny-backend.onrender.com/api/health

# Chat test
curl -X POST https://codesunny-backend.onrender.com/api/mcp/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Full test suite
npm run test:prod
```

## 🚨 Quick Fixes

### CORS Error

```bash
# Update backend env var
CORS_ORIGIN=https://codesunny.vercel.app,https://www.codesunny.com
# Restart backend service
```

### API Not Working

```bash
# Check frontend env var
VITE_API_URL=https://codesunny-backend.onrender.com
# Rebuild frontend
```

### Build Failed

```bash
# Test locally first
npm run build:prod
# Fix errors, then push
```

## 📱 URLs to Bookmark

- **Frontend:** https://codesunny.vercel.app
- **Backend:** https://codesunny-backend.onrender.com
- **Health Check:** https://codesunny-backend.onrender.com/api/health
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com

## 🎓 Need More Details?

- Full guide: `PRODUCTION_DEPLOYMENT_GUIDE.md`
- Checklist: `DEPLOYMENT_CHECKLIST.md`
- Test script: `test-production.js`

---

**Pro Tip:** Bookmark this file for quick reference during deployments!
