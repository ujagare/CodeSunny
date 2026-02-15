# 🚀 PRODUCTION LAUNCH CHECKLIST

## ✅ COMPLETE BEFORE LAUNCH

This checklist ensures your platform is **genuinely production-ready**, not just "working".

---

## 📋 PHASE 1: STRUCTURAL ENFORCEMENT (CRITICAL)

### ✅ Step 1: Tool Registry Enforcement

```bash
# Check that all tools are wrapped
python -c "from tool_registry import verify_all_tools_wrapped; verify_all_tools_wrapped()"
```

**Expected:** All tools registered, no missing wrappers
**If fails:** Server will NOT start (by design)

### ✅ Step 2: Production Checks

```bash
# Run comprehensive checks
python production_checks.py
```

**Must pass:**

- ✅ No secret leaks
- ✅ Environment variables set
- ✅ Log directory writable

**Should pass (warnings OK):**

- ⚠️ Redis connection (optional)
- ⚠️ No blocking calls
- ⚠️ Uvicorn workers

### ✅ Step 3: Static Code Scan

```bash
# Check for unwrapped endpoints
grep -r "@app.post" . | grep -v "secure_tool"
grep -r "@mcp.tool" . | grep -v "secure_tool"
```

**Expected:** No results (all endpoints wrapped)

---

## 📋 PHASE 2: LOAD TESTING (MANDATORY)

### ✅ Step 4: Install Locust

```bash
pip install locust psutil
```

### ✅ Step 5: Run Load Test

```bash
# Start server
python server.py

# In another terminal, run load test
locust -f locustfile.py --host=http://localhost:8000 --users 200 --spawn-rate 20 --run-time 10m --headless
```

**Pass Criteria:**

- ✅ 200 concurrent users stable for 10 minutes
- ✅ Average response time < 500ms
- ✅ Error rate < 1%
- ✅ No memory growth trend
- ✅ CPU usage < 80%

### ✅ Step 6: Memory Profiling

```bash
# Monitor memory during load test
python -c "
import psutil
import time
import os

process = psutil.Process(os.getpid())
for i in range(600):  # 10 minutes
    mem_mb = process.memory_info().rss / 1024 / 1024
    print(f'{i}s: {mem_mb:.2f} MB')
    time.sleep(1)
"
```

**Expected:** Memory stable or slight growth, no continuous increase

---

## 📋 PHASE 3: FAILURE SIMULATION (CRITICAL)

### ✅ Step 7: Test Invalid Input

```bash
# Test XSS prevention
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "<script>alert(1)</script>"}'

# Expected: {"error": "validation_failed"}
```

### ✅ Step 8: Test Rate Limiting

```bash
# Send 10 payment requests rapidly
for i in {1..10}; do
  curl -X POST http://localhost:8000/api/generate-payment-link \
    -H "Content-Type: application/json" \
    -d '{"client_name":"Test","client_email":"test@example.com","amount":1000,"description":"Test"}'
done

# Expected: First 5 succeed, rest rate limited
```

### ✅ Step 9: Test Circuit Breaker

```bash
# Disconnect internet, call AI endpoint
# Expected: Retry 3 times, then circuit opens, graceful error
```

### ✅ Step 10: Test Token Overflow

```bash
# Send 30 long messages
for i in {1..30}; do
  curl -X POST http://localhost:8000/api/chat \
    -H "Content-Type: application/json" \
    -d "{\"message\": \"This is a very long message number $i with lots of text to test token management and auto-compression features\"}"
done

# Expected: Auto-compression after 20 messages
```

---

## 📋 PHASE 4: SECURITY AUDIT

### ✅ Step 11: Check Secret Leaks

```bash
# Search for hardcoded secrets
grep -r "api_key.*=" . --include="*.py" | grep -v ".env"
grep -r "password.*=" . --include="*.py" | grep -v ".env"

# Expected: No results (all secrets in .env)
```

### ✅ Step 12: Check Stack Trace Exposure

```bash
# Trigger error, check response
curl -X POST http://localhost:8000/api/invalid-endpoint

# Expected: Generic error message, NO stack trace
```

### ✅ Step 13: Check Security Headers

```bash
curl -I http://localhost:8000/health

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

---

## 📋 PHASE 5: MONITORING SETUP

### ✅ Step 14: Verify Logging

```bash
# Check logs are being written
ls -lh logs/
tail -f logs/mcp_server.log

# Expected: Logs in JSON format, rotating properly
```

### ✅ Step 15: Check Audit Trail

```bash
# Generate payment link, check audit log
curl -X POST http://localhost:8000/api/generate-payment-link \
  -H "Content-Type: application/json" \
  -d '{"client_name":"Audit Test","client_email":"audit@example.com","amount":1000,"description":"Test"}'

# Check audit log
tail logs/audit.log

# Expected: Payment operation logged
```

### ✅ Step 16: Monitor Circuit Breakers

```bash
curl http://localhost:8000/api/circuit-breakers

# Expected: All circuits CLOSED, failure count 0
```

---

## 📋 PHASE 6: PAYMENT SANDBOX TESTING

### ✅ Step 17: Razorpay Test Mode

```bash
# Ensure using test keys
grep "RAZORPAY_KEY_ID" .env

# Expected: rzp_test_xxxxx (not rzp_live_xxxxx)
```

### ✅ Step 18: Test Payment Flow

```bash
# Generate test payment link
curl -X POST http://localhost:8000/api/generate-payment-link \
  -H "Content-Type: application/json" \
  -d '{"client_name":"Test","client_email":"test@example.com","amount":1000,"description":"Test Payment"}'

# Expected: Payment link generated, logged in audit trail
```

### ✅ Step 19: Test Idempotency

```bash
# Send same payment request twice
# Expected: Duplicate detection or idempotency key handling
```

---

## 📋 PHASE 7: REDIS SETUP (RECOMMENDED)

### ✅ Step 20: Install Redis

```bash
# Windows (using Chocolatey)
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server
```

### ✅ Step 21: Update Rate Limiter

```python
# In rate_limiter.py, replace in-memory dict with Redis
import redis
r = redis.Redis(host='localhost', port=6379)

def check_rate_limit(user_id, tier):
    key = f"rate:{user_id}:{tier}"
    count = r.incr(key)
    if count == 1:
        r.expire(key, window)
    return count <= max_requests
```

### ✅ Step 22: Test Redis Rate Limiting

```bash
# Restart server, test rate limiting
# Expected: Rate limits persist across server restarts
```

---

## 📋 PHASE 8: UVICORN PRODUCTION CONFIG

### ✅ Step 23: Multi-Worker Setup

```bash
# Production start command
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4 --limit-concurrency 200 --timeout-keep-alive 5
```

### ✅ Step 24: Test Under Load

```bash
# Run load test with production config
locust -f locustfile.py --host=http://localhost:8000 --users 200 --spawn-rate 20 --run-time 10m --headless
```

---

## 📋 PHASE 9: FINAL VERIFICATION

### ✅ Step 25: Complete Test Suite

```bash
python test_hardening.py
```

**Expected:** All tests pass

### ✅ Step 26: Tool Registry Check

```bash
python -c "from tool_registry import get_tool_stats; import json; print(json.dumps(get_tool_stats(), indent=2))"
```

**Expected:** All required tools registered

### ✅ Step 27: Production Checks

```bash
python production_checks.py
```

**Expected:** All critical checks pass

---

## 📊 LAUNCH CRITERIA

### ✅ MUST PASS (Blockers)

- [ ] All tools wrapped (tool_registry check)
- [ ] No secret leaks
- [ ] Environment variables set
- [ ] Load test: 200 users stable for 10 min
- [ ] Error rate < 1%
- [ ] No memory leaks
- [ ] Rate limiting working
- [ ] Circuit breakers working
- [ ] Logging working
- [ ] Audit trail working
- [ ] Payment sandbox tested

### ⚠️ SHOULD PASS (Warnings)

- [ ] Redis connected (optional, can use in-memory)
- [ ] No blocking calls (can optimize later)
- [ ] Multi-worker setup (can start with 1)
- [ ] Average response < 500ms (can optimize)

---

## 🚀 LAUNCH COMMAND

### Development

```bash
python server.py
```

### Production

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4 --limit-concurrency 200 --timeout-keep-alive 5 --log-level info
```

### With Process Manager (Recommended)

```bash
# Using PM2
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4" --name mcp-server

# Or using systemd (Linux)
# Create /etc/systemd/system/mcp-server.service
```

---

## 📈 POST-LAUNCH MONITORING

### Day 1-7: Critical Monitoring

- [ ] Check logs every 2 hours
- [ ] Monitor error rate
- [ ] Monitor response times
- [ ] Monitor memory usage
- [ ] Check circuit breaker states
- [ ] Review audit trail

### Week 2-4: Optimization

- [ ] Analyze slow endpoints
- [ ] Optimize database queries
- [ ] Add caching where needed
- [ ] Fine-tune rate limits
- [ ] Adjust circuit breaker thresholds

### Month 2+: Scaling

- [ ] Add load balancer
- [ ] Set up Redis cluster
- [ ] Add CDN for static assets
- [ ] Implement database replication
- [ ] Set up monitoring dashboard

---

## 🎯 SUCCESS METRICS

### Technical Metrics

- ✅ Uptime > 99.9%
- ✅ Average response time < 500ms
- ✅ Error rate < 0.1%
- ✅ No security incidents
- ✅ No data leaks

### Business Metrics

- ✅ Lead capture rate > 5%
- ✅ Quote-to-proposal conversion > 30%
- ✅ Proposal-to-payment conversion > 20%
- ✅ Customer satisfaction > 4.5/5

---

## 🏁 FINAL CHECKLIST

Before launching to production:

- [ ] All Phase 1 checks passed (structural enforcement)
- [ ] All Phase 2 checks passed (load testing)
- [ ] All Phase 3 checks passed (failure simulation)
- [ ] All Phase 4 checks passed (security audit)
- [ ] All Phase 5 checks passed (monitoring setup)
- [ ] All Phase 6 checks passed (payment testing)
- [ ] Phase 7 completed or skipped (Redis optional)
- [ ] Phase 8 completed (Uvicorn config)
- [ ] Phase 9 completed (final verification)
- [ ] Launch criteria met
- [ ] Team trained on monitoring
- [ ] Incident response plan ready
- [ ] Backup and recovery tested

**If all checked:** 🚀 **READY TO LAUNCH!**

---

**Remember:** Production-ready ≠ Feature-complete

Focus on:

- ✅ Stability over features
- ✅ Security over speed
- ✅ Monitoring over optimization
- ✅ Reliability over complexity

**Launch when stable, optimize while running.**
