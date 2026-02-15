# 🚀 Production Deployment Checklist

## Pre-Deployment

### Environment Configuration

- [ ] `.env.production` created with `VITE_API_URL`
- [ ] `backend/.env.production` created with all required variables
- [ ] `CORS_ORIGIN` includes production frontend URL
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are strong and unique
- [ ] MongoDB connection string is correct
- [ ] MCP_URL points to production MCP server

### Code Updates

- [ ] ChatWidget uses `import.meta.env.VITE_API_URL`
- [ ] All API calls use environment variable
- [ ] No hardcoded localhost URLs
- [ ] Build runs successfully: `npm run build:prod`

### Security

- [ ] Environment files are in `.gitignore`
- [ ] No secrets committed to Git
- [ ] CORS is restricted to specific domains
- [ ] Rate limiting is enabled
- [ ] Helmet security headers configured

## Deployment Steps

### 1. Frontend (Vercel)

- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables set in Vercel:
  - `VITE_API_URL` = `https://codesunny-backend.onrender.com`
  - `VITE_APP_ENV` = `production`
- [ ] Build successful
- [ ] Deployment live

### 2. Backend (Render/Railway/Heroku)

- [ ] Service created
- [ ] Environment variables configured
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Root directory: `backend`
- [ ] Deployment successful
- [ ] Health check passes: `/api/health`

### 3. MCP Server (Render)

- [ ] Service created
- [ ] Environment variables configured
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `python server.py`
- [ ] Root directory: `mcp-server`
- [ ] Deployment successful

## Post-Deployment Testing

### Automated Tests

```bash
# Run production tests
npm run test:prod
```

### Manual Tests

- [ ] Frontend loads correctly
- [ ] Chat widget opens
- [ ] Send test message in chat
- [ ] Search functionality works
- [ ] Lead form submission works
- [ ] No CORS errors in console
- [ ] All pages load correctly
- [ ] Mobile responsive

### API Endpoints

```bash
# Health check
curl https://codesunny-backend.onrender.com/api/health

# Chat endpoint
curl -X POST https://codesunny-backend.onrender.com/api/mcp/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Search endpoint
curl -X POST https://codesunny-backend.onrender.com/api/mcp/search \
  -H "Content-Type: application/json" \
  -d '{"query":"SEO"}'

# Lead endpoint
curl -X POST https://codesunny-backend.onrender.com/api/mcp/lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"test"}'
```

## Monitoring

### First 24 Hours

- [ ] Check backend logs for errors
- [ ] Monitor response times
- [ ] Check error rates
- [ ] Verify database connections
- [ ] Monitor memory/CPU usage

### Ongoing

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Monitor API usage
- [ ] Check SSL certificate expiry

## Rollback Plan

If issues occur:

1. **Frontend Issues**

   ```bash
   # Revert to previous deployment in Vercel dashboard
   # Or rollback Git commit and redeploy
   git revert HEAD
   git push origin main
   ```

2. **Backend Issues**

   ```bash
   # Revert deployment in hosting platform
   # Or rollback Git commit
   git revert HEAD
   git push origin main
   ```

3. **Database Issues**
   - Restore from backup
   - Check connection strings
   - Verify MongoDB Atlas status

## Common Issues & Solutions

### CORS Errors

**Problem:** "Access-Control-Allow-Origin" error
**Solution:**

- Check `CORS_ORIGIN` in backend env vars
- Ensure frontend URL is included
- Restart backend service

### API Not Responding

**Problem:** Chat widget shows "temporarily unavailable"
**Solution:**

- Verify backend is running
- Check `VITE_API_URL` in frontend
- Test health endpoint directly

### Environment Variables Not Loading

**Problem:** App uses wrong configuration
**Solution:**

- Verify env vars in deployment platform
- Check variable names match exactly
- Rebuild and redeploy

### Build Failures

**Problem:** Build fails during deployment
**Solution:**

- Check build logs
- Verify all dependencies are in package.json
- Test build locally: `npm run build:prod`

## Success Criteria

✅ All automated tests pass
✅ Frontend loads without errors
✅ Chat widget works end-to-end
✅ Search returns results
✅ Lead form submits successfully
✅ No console errors
✅ CORS configured correctly
✅ SSL certificate valid
✅ Response times < 2s
✅ Mobile responsive

## Contact & Support

- **Documentation:** See `PRODUCTION_DEPLOYMENT_GUIDE.md`
- **Testing:** Run `npm run test:prod`
- **Logs:** Check deployment platform dashboards

---

**Last Updated:** February 2026
**Deployment Date:** ******\_******
**Deployed By:** ******\_******
