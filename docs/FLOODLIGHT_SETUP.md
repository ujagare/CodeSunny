# 📊 DoubleClick Floodlight Tracking - Complete Guide

## ✅ What's Implemented

DoubleClick Floodlight tracking is now integrated for conversion tracking and remarketing.

---

## 🎯 What is Floodlight?

Floodlight is Google's conversion tracking system that:

- Tracks conversions from Google Ads
- Enables remarketing campaigns
- Measures ROI of ad campaigns
- Provides detailed analytics

---

## 📁 Files Created

1. **`src/utils/floodlight.js`** - Floodlight tracking utilities
2. **`src/App.jsx`** - Initialized Floodlight
3. **`src/Components/ChatWidget.jsx`** - Added conversion tracking
4. **`.env.example`** - Configuration template

---

## 🔧 Setup Instructions

### Step 1: Get Floodlight IDs

1. Login to **Google Campaign Manager 360** (formerly DoubleClick Campaign Manager)
2. Go to: Advertiser → Floodlight Configuration
3. Note down:
   - **Floodlight Configuration ID** (src)
   - **Activity Tag String** (type)
   - **Group Tag String** (cat)

### Step 2: Configure Environment Variables

Create/update `.env` file:

```env
# DoubleClick Floodlight Configuration
VITE_FLOODLIGHT_SRC=12345678
VITE_FLOODLIGHT_TYPE=codesunny
VITE_FLOODLIGHT_CAT=conversion
```

Replace with your actual IDs from Google Campaign Manager.

### Step 3: Create Floodlight Activities

In Google Campaign Manager, create these activities:

1. **Lead Capture** - `conversion+standard`
2. **Quote Request** - `quote+standard`
3. **Meeting Scheduled** - `meeting+standard`
4. **SEO Audit** - `seoaudit+standard`
5. **Image Generation** - `image+standard`

---

## 📊 Tracked Events

### 1. Page View

**When:** User visits any page  
**Data:** Page path

```javascript
trackPageView("/services");
```

### 2. Lead Capture

**When:** User submits contact form  
**Data:** Name, email, service, estimated value

```javascript
trackLeadCapture({
  leadId: Date.now(),
  name: "John Doe",
  email: "john@example.com",
  service: "web development",
  estimatedValue: 25000,
});
```

### 3. Quote Request

**When:** User requests a quote  
**Data:** Service, budget, amount

```javascript
trackQuoteRequest({
  quoteId: Date.now(),
  service: "ecommerce",
  budget: "₹50,000",
  amount: 50000,
});
```

### 4. Meeting Scheduled

**When:** User schedules a meeting  
**Data:** Name, email, meeting ID

```javascript
trackMeetingScheduled({
  meetingId: Date.now(),
  name: "John Doe",
  email: "john@example.com",
});
```

### 5. SEO Audit

**When:** User requests SEO audit  
**Data:** URL, audit ID, score

```javascript
trackSEOAudit({
  auditId: Date.now(),
  url: "https://example.com",
  score: 75,
});
```

### 6. Image Generation

**When:** User generates AI image  
**Data:** Prompt, style, image ID

```javascript
trackImageGeneration({
  imageId: Date.now(),
  prompt: "modern website hero",
  style: "digital-art",
});
```

---

## 🎯 Conversion Values

Default values assigned:

| Event             | Value (INR) | Notes                   |
| ----------------- | ----------- | ----------------------- |
| Lead Capture      | 25,000      | Average project value   |
| Quote Request     | Variable    | Based on quote amount   |
| Meeting Scheduled | 5,000       | Estimated meeting value |
| SEO Audit         | 0           | Free service            |
| Image Generation  | 0           | Free service            |

---

## 📈 Custom Parameters

Floodlight supports custom parameters (u1-u20):

```javascript
trackLeadCapture({
  leadId: Date.now(),
  name: "John", // u1
  email: "john@...", // u2
  service: "web", // u3
  estimatedValue: 25000,
});
```

These can be used for:

- Segmentation
- Reporting
- Remarketing lists

---

## 🔍 Verification

### 1. Browser Console

Check for Floodlight logs:

```
✅ Floodlight initialized
📊 Floodlight: Page view tracked /
🎯 Floodlight: Lead captured {leadId: ...}
```

### 2. Network Tab

Look for requests to:

```
https://ad.doubleclick.net/ddm/activity/...
```

### 3. Google Tag Assistant

1. Install: [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Visit your site
3. Check for Floodlight tags

### 4. Campaign Manager Reports

1. Login to Google Campaign Manager 360
2. Go to: Reporting → Floodlight
3. Check conversion data

---

## 🎨 Remarketing

Floodlight enables remarketing campaigns:

```javascript
// Track user behavior for remarketing
trackRemarketing({
  userId: "user123",
  userType: "lead",
  pageType: "services",
});
```

Use cases:

- Retarget visitors who didn't convert
- Show specific ads based on pages visited
- Create lookalike audiences

---

## 🔒 Privacy & GDPR

### Cookie Consent

Floodlight uses cookies. Ensure compliance:

```javascript
// Only initialize if user consents
if (userConsented) {
  initFloodlight();
}
```

### Data Collection

Floodlight collects:

- Page views
- Conversions
- Custom parameters
- User behavior

Ensure your privacy policy covers this.

---

## 🧪 Testing

### Development Mode

Test without affecting production data:

```javascript
// Use test Floodlight ID
VITE_FLOODLIGHT_SRC = test12345678;
```

### Debug Mode

Enable verbose logging:

```javascript
// In floodlight.js
console.log("🔍 Floodlight Debug:", eventData);
```

---

## 📊 Reporting

### Available Reports in Campaign Manager:

1. **Conversion Report**

   - Total conversions
   - Conversion rate
   - Cost per conversion

2. **Path to Conversion**

   - User journey
   - Touchpoints
   - Attribution

3. **Floodlight Report**
   - Activity performance
   - Custom parameter analysis

---

## 🚀 Advanced Features

### 1. Dynamic Remarketing

Track product views:

```javascript
trackCustomEvent("product_view", {
  product_id: "123",
  product_name: "Web Development",
  product_price: 50000,
});
```

### 2. Cross-Device Tracking

Enable with User ID:

```javascript
trackRemarketing({
  userId: "user123", // Consistent across devices
});
```

### 3. Offline Conversions

Import offline conversions to Campaign Manager for complete tracking.

---

## 🎯 Best Practices

### 1. Naming Convention

Use clear, consistent names:

- `lead_capture` not `lc`
- `quote_request` not `qr`

### 2. Value Assignment

Assign realistic values:

- Based on historical data
- Consider lifetime value
- Update regularly

### 3. Testing

Always test before production:

- Use test IDs
- Verify in Tag Assistant
- Check Campaign Manager

### 4. Documentation

Document all activities:

- Activity name
- Purpose
- Custom parameters
- Expected volume

---

## 🐛 Troubleshooting

### Floodlight Not Loading?

**Check:**

1. Environment variables set correctly
2. Floodlight ID valid
3. No ad blockers
4. Console for errors

### Conversions Not Tracking?

**Check:**

1. Activity created in Campaign Manager
2. Activity tag string matches
3. Network tab for requests
4. Tag Assistant shows tag firing

### Wrong Conversion Values?

**Check:**

1. Value parameter in tracking call
2. Currency set to INR
3. Campaign Manager activity settings

---

## 📞 Support

### Google Campaign Manager Support:

- Help Center: https://support.google.com/campaignmanager
- Community: https://support.google.com/campaignmanager/community

### Implementation Issues:

- Check browser console
- Use Tag Assistant
- Review Network tab
- Contact Google support

---

## ✅ Checklist

Before going live:

- [ ] Floodlight IDs configured in `.env`
- [ ] Activities created in Campaign Manager
- [ ] Tracking verified in Tag Assistant
- [ ] Test conversions recorded
- [ ] Privacy policy updated
- [ ] Cookie consent implemented
- [ ] Team trained on reporting

---

## 📈 Expected Results

After implementation:

- ✅ Track all conversions from ads
- ✅ Measure ROI accurately
- ✅ Create remarketing audiences
- ✅ Optimize ad campaigns
- ✅ Improve conversion rates

---

## 🎯 Summary

Floodlight tracking is now:

- ✅ Integrated in app
- ✅ Tracking key conversions
- ✅ Ready for remarketing
- ✅ GDPR-aware
- ✅ Production-ready

**Next:** Configure your Floodlight IDs and start tracking!

---

**Status:** ✅ IMPLEMENTED

**Documentation:** Complete

**Ready for:** Production use with proper IDs
