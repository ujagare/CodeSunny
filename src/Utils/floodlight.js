/**
 * DoubleClick Floodlight Tracking
 * Google's conversion tracking for ads
 */

// Floodlight Configuration
const FLOODLIGHT_CONFIG = {
  src: import.meta.env.VITE_FLOODLIGHT_SRC || "12345678", // Your Floodlight Source ID
  type: import.meta.env.VITE_FLOODLIGHT_TYPE || "codesunny",
  cat: import.meta.env.VITE_FLOODLIGHT_CAT || "conversion",
};

/**
 * Initialize Floodlight tracking
 */
export const initFloodlight = () => {
  // Add Floodlight script to page
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=DC-${FLOODLIGHT_CONFIG.src}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", `DC-${FLOODLIGHT_CONFIG.src}`);

  console.log("✅ Floodlight initialized");
};

/**
 * Track page view
 */
export const trackPageView = (pagePath) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      send_to: `DC-${FLOODLIGHT_CONFIG.src}`,
    });
    console.log("📊 Floodlight: Page view tracked", pagePath);
  }
};

/**
 * Track lead capture (form submission)
 */
export const trackLeadCapture = (leadData) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `DC-${FLOODLIGHT_CONFIG.src}/${FLOODLIGHT_CONFIG.type}/${FLOODLIGHT_CONFIG.cat}+standard`,
      value: leadData.estimatedValue || 0,
      currency: "INR",
      transaction_id: leadData.leadId || Date.now(),
      u1: leadData.name || "",
      u2: leadData.email || "",
      u3: leadData.service || "",
    });
    console.log("🎯 Floodlight: Lead captured", leadData);
  }
};

/**
 * Track quote request
 */
export const trackQuoteRequest = (quoteData) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `DC-${FLOODLIGHT_CONFIG.src}/${FLOODLIGHT_CONFIG.type}/quote+standard`,
      value: quoteData.amount || 0,
      currency: "INR",
      transaction_id: quoteData.quoteId || Date.now(),
      u1: quoteData.service || "",
      u2: quoteData.budget || "",
    });
    console.log("💰 Floodlight: Quote requested", quoteData);
  }
};

/**
 * Track meeting scheduled
 */
export const trackMeetingScheduled = (meetingData) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `DC-${FLOODLIGHT_CONFIG.src}/${FLOODLIGHT_CONFIG.type}/meeting+standard`,
      value: 5000, // Estimated value of a meeting
      currency: "INR",
      transaction_id: meetingData.meetingId || Date.now(),
      u1: meetingData.name || "",
      u2: meetingData.email || "",
    });
    console.log("📅 Floodlight: Meeting scheduled", meetingData);
  }
};

/**
 * Track SEO audit request
 */
export const trackSEOAudit = (auditData) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `DC-${FLOODLIGHT_CONFIG.src}/${FLOODLIGHT_CONFIG.type}/seoaudit+standard`,
      value: 0, // Free audit
      currency: "INR",
      transaction_id: auditData.auditId || Date.now(),
      u1: auditData.url || "",
    });
    console.log("🔍 Floodlight: SEO audit tracked", auditData);
  }
};

/**
 * Track image generation
 */
export const trackImageGeneration = (imageData) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: `DC-${FLOODLIGHT_CONFIG.src}/${FLOODLIGHT_CONFIG.type}/image+standard`,
      value: 0,
      currency: "INR",
      transaction_id: imageData.imageId || Date.now(),
      u1: imageData.prompt || "",
    });
    console.log("🎨 Floodlight: Image generation tracked", imageData);
  }
};

/**
 * Track custom event
 */
export const trackCustomEvent = (eventName, eventData = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      send_to: `DC-${FLOODLIGHT_CONFIG.src}`,
      ...eventData,
    });
    console.log(
      `📊 Floodlight: Custom event tracked - ${eventName}`,
      eventData,
    );
  }
};

/**
 * Track remarketing (for retargeting ads)
 */
export const trackRemarketing = (userData = {}) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "remarketing", {
      send_to: `DC-${FLOODLIGHT_CONFIG.src}`,
      user_id: userData.userId || "",
      user_type: userData.userType || "visitor",
      page_type: userData.pageType || "general",
    });
    console.log("🎯 Floodlight: Remarketing tracked", userData);
  }
};

export default {
  init: initFloodlight,
  trackPageView,
  trackLeadCapture,
  trackQuoteRequest,
  trackMeetingScheduled,
  trackSEOAudit,
  trackImageGeneration,
  trackCustomEvent,
  trackRemarketing,
};
