# Production Deployment Guide

## 🚀 Overview

Complete guide for deploying CodeSunny to production with proper environment configuration.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

#### Frontend (.env.production)

```env
VITE_API_URL=https://codesunny-backend.onrender.com
VITE_APP_ENV=production
```

#### Backend (backend/.env.production)

```env
PORT=5000
NODE_ENV=production
USE_VITE_DEV_SERVER=false
MONGO_URI=mongodb+srv://[username]:[password]@cluster.mongodb.net/codesunny
JWT_SECRET=[your-secret-key]
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=[your-refresh-secret]
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=https://codesunny.vercel.app,https://www.codesunny.com
APP_URL=https://codesunny-backend.onrender.com
MCP_URL=https://codesunny-mcp.onrender.com/mcp
REQUIRE_EMAIL_VERIFICATION=true
EMAIL_FROM=no-reply@codesunny.com
LOG_LEVEL=info
```

### 2. CORS Configuration

Backend automatically handles CORS based on `CORS_ORIGIN` environment variable:

- Multiple origins: Comma-separated list
- Single origin: Single URL
- All origins: Set to "\*" (not recommended for production)

### 3. API URL Configuration

Frontend uses environment variable for API calls:

- Development: Empty string (uses Vite proxy)
- Production: Full backend URL

## 🔧 Deployment Steps

### Frontend (Vercel)

1. **Push code to GitHub**

   ```bash
   git add .
   git commit -m "Production deployment configuration"
   git push origin main
   ```

2. **Configure Vercel**

   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add production variables:
     - `VITE_API_URL` = `https://codesunny-backend.onrender.com`
     - `VITE_APP_ENV` = `production`

3. **Deploy**
   - Vercel auto-deploys on push
   - Or manually trigger: `vercel --prod`

### Backend (Render/Railway/Heroku)

#### Option 1: Render.com

1. **Create Web Service**

   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables**
   Add all variables from `backend/.env.production`

3. **Deploy**
   - Render auto-deploys on push

#### Option 2: Railway

1. **Create New Project**

   ```bash
   cd backend
   railway init
   railway up
   ```

2. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=5000
   # ... add all other variables
   ```

#### Option 3: Heroku

1. **Create App**

   ```bash
   cd backend
   heroku create codesunny-backend
   ```

2. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   # ... add all other variables
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### MCP Server (Render)

1. **Create Web Service**

   - Root Directory: `mcp-server`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python server.py`

2. **Environment Variables**
   Add variables from `mcp-server/.env`

## ✅ Testing Production Deployment

### 1. Health Check

```bash
curl https://codesunny-backend.onrender.com/api/health
```

Expected response:

```json
{ "status": "ok" }
```

### 2. CORS Test

Open browser console on production site:

```javascript
fetch("https://codesunny-backend.onrender.com/api/health")
  .then((r) => r.json())
  .then(console.log);
```

### 3. Chat Widget Test

1. Open production site
2. Click "Chat with AI" button
3. Send a test message
4. Verify response

### 4. Lead Form Test

1. Switch to "Contact" tab
2. Fill form with test data
3. Submit and verify success message

## 🔍 Troubleshooting

### CORS Errors

**Problem:** "Access-Control-Allow-Origin" error

**Solution:**

1. Check `CORS_ORIGIN` in backend environment variables
2. Ensure frontend URL is included
3. Restart backend service

### API Connection Failed

**Problem:** Chat widget shows "temporarily unavailable"

**Solution:**

1. Verify `VITE_API_URL` in frontend environment
2. Check backend is running: `curl [backend-url]/api/health`
3. Check browser console for exact error

### Environment Variables Not Loading

**Problem:** App uses wrong configuration

**Solution:**

1. Verify `.env.production` exists
2. Check deployment platform has variables set
3. Rebuild and redeploy

## 📊 Monitoring

### Backend Logs

```bash
# Render
View in Render Dashboard → Logs

# Railway
railway logs

# Heroku
heroku logs --tail
```

### Frontend Errors

- Check Vercel Dashboard → Deployments → Function Logs
- Use browser DevTools Console

## 🔐 Security Checklist

- [ ] JWT secrets are strong and unique
- [ ] CORS_ORIGIN is set to specific domains (not "\*")
- [ ] MongoDB connection uses strong password
- [ ] Environment variables are not committed to Git
- [ ] HTTPS is enabled on all services
- [ ] Rate limiting is active
- [ ] Helmet security headers are enabled

## 🚦 Performance Optimization

- [ ] Frontend build is minified
- [ ] Images are optimized
- [ ] PWA is configured
- [ ] CDN is used for static assets
- [ ] Database indexes are created
- [ ] API responses are cached where appropriate

## 📝 Post-Deployment

1. **Update DNS** (if using custom domain)
2. **Configure SSL** (usually automatic)
3. **Set up monitoring** (Sentry, LogRocket, etc.)
4. **Enable analytics** (Google Analytics, Plausible, etc.)
5. **Test all features** thoroughly
6. **Monitor logs** for first 24 hours

## 🔄 Continuous Deployment

### Automatic Deployment

- Frontend: Auto-deploys on push to `main` branch
- Backend: Auto-deploys on push to `main` branch

### Manual Deployment

```bash
# Frontend
vercel --prod

# Backend (if using Railway)
railway up

# Backend (if using Heroku)
git push heroku main
```

## 📞 Support

If you encounter issues:

1. Check logs first
2. Verify environment variables
3. Test API endpoints directly
4. Check CORS configuration
5. Review this guide again

---

**Last Updated:** February 2026
**Version:** 1.0.0
