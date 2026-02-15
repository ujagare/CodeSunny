# 🔐 Zoho DNS Setup - Production Grade

## ✅ Critical for Email Deliverability

Without proper DNS setup, your emails will go to spam!

---

## 1️⃣ SPF Record (MUST HAVE)

**What:** Sender Policy Framework - Verifies sender

**Add to DNS:**

```
Type: TXT
Host: @
Value: v=spf1 include:zoho.in ~all
TTL: 3600
```

**For International:**

```
v=spf1 include:zoho.com ~all
```

**Check:**

```bash
nslookup -type=txt codesunny.in
```

---

## 2️⃣ DKIM Record (HIGHLY RECOMMENDED)

**What:** DomainKeys Identified Mail - Email authentication

**Setup:**

1. Login to Zoho Mail Admin
2. Go to: Settings → Email Configuration → DKIM
3. Click "Add DKIM"
4. Copy the TXT record
5. Add to your DNS:
   ```
   Type: TXT
   Host: zoho._domainkey
   Value: [Zoho provided value]
   TTL: 3600
   ```

**Verify in Zoho after 24 hours**

---

## 3️⃣ DMARC Record (PROFESSIONAL)

**What:** Domain-based Message Authentication

**Add to DNS:**

```
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none; rua=mailto:information@codesunny.in
TTL: 3600
```

**Gradual Enforcement:**

- Start: `p=none` (monitoring only)
- After 1 month: `p=quarantine` (suspicious to spam)
- After 3 months: `p=reject` (reject unauthorized)

---

## 4️⃣ MX Records (Already Done)

**Check if correct:**

```
Type: MX
Priority: 10
Value: mx.zoho.in

Priority: 20
Value: mx2.zoho.in

Priority: 50
Value: mx3.zoho.in
```

---

## 🧪 Test Your Setup

### Online Tools:

1. **MXToolbox:** https://mxtoolbox.com/SuperTool.aspx

   - Enter: `codesunny.in`
   - Check: SPF, DKIM, DMARC

2. **Mail Tester:** https://www.mail-tester.com

   - Send test email
   - Get spam score (aim for 10/10)

3. **Google Admin Toolbox:** https://toolbox.googleapps.com/apps/checkmx/
   - Check MX records

---

## 📊 Expected Results

### Before DNS Setup:

- Spam Score: 3-5/10
- Deliverability: 50-60%
- Spam folder: High chance

### After DNS Setup:

- Spam Score: 8-10/10
- Deliverability: 95-99%
- Spam folder: Low chance

---

## ⚠️ Common Issues

### SPF Not Working?

- Wait 24-48 hours for DNS propagation
- Check syntax (no extra spaces)
- Only ONE SPF record per domain

### DKIM Not Verified?

- Wait 24 hours after adding
- Check Host name (zoho.\_domainkey)
- Verify in Zoho Admin Panel

### Still Going to Spam?

- Check email content (avoid spam words)
- Warm up domain (start with few emails)
- Monitor bounce rate

---

## 🎯 Quick Setup Checklist

- [ ] SPF record added
- [ ] DKIM enabled in Zoho
- [ ] DKIM record added to DNS
- [ ] DMARC record added
- [ ] MX records verified
- [ ] Wait 24-48 hours
- [ ] Test with mail-tester.com
- [ ] Send test emails
- [ ] Check spam folder

---

## 📞 Where to Add DNS Records

### Hostinger:

1. Login to Hostinger
2. Domains → Manage
3. DNS / Name Servers → DNS Zone
4. Add records

### GoDaddy:

1. Login to GoDaddy
2. My Products → Domains
3. DNS → Manage Zones
4. Add records

### Cloudflare:

1. Login to Cloudflare
2. Select domain
3. DNS → Records
4. Add records

---

## ✅ Verification Commands

```bash
# Check SPF
nslookup -type=txt codesunny.in

# Check DKIM
nslookup -type=txt zoho._domainkey.codesunny.in

# Check DMARC
nslookup -type=txt _dmarc.codesunny.in

# Check MX
nslookup -type=mx codesunny.in
```

---

## 🚀 After Setup

Your email system will be:

- ✅ Professional
- ✅ Trusted by Gmail/Outlook
- ✅ High deliverability
- ✅ Low spam rate
- ✅ Production-ready

---

**Status:** ⏳ Pending DNS Setup  
**Priority:** HIGH  
**Impact:** 50% improvement in deliverability
