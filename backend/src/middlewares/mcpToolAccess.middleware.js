const ApiError = require("../utils/apiError");

const publicTools = new Set([
  "search",
  "fetch",
  "chat",
  "chat_old",
  "create_lead",
  "calculate_quote",
  "seo_audit",
  "cloud_calculator",
  "schedule_consultation_google",
  "project_status",
]);

const userTools = new Set([
  "generate_image",
  "check_server_health",
  "save_to_crm",
  "get_analytics_summary",
  "client_dashboard_summary",
  "generate_proposal_pdf",
  "update_lead_stage",
]);

const adminTools = new Set([
  "crm_pipeline_manager",
  "get_pipeline_summary",
  "monthly_revenue_projection",
  "payment_link_generator",
  "generate_payment_link_razorpay",
  "send_auto_response",
  "campaign_budget_calculator",
]);

const getInternalKeys = () =>
  (process.env.MCP_INTERNAL_KEYS || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

const hasInternalKey = (req) => {
  const key = req.headers["x-mcp-internal-key"];
  if (!key) return false;
  return getInternalKeys().includes(String(key));
};

const requiredLevel = (toolName) => {
  if (publicTools.has(toolName)) return "public";
  if (userTools.has(toolName)) return "user";
  if (adminTools.has(toolName)) return "admin";
  return "admin";
};

const enforceToolAccess = (toolName) => (req, _res, next) => {
  const level = requiredLevel(toolName);

  if (hasInternalKey(req)) {
    req.mcpAccess = { level, principal: "internal" };
    return next();
  }

  if (level === "public") {
    req.mcpAccess = { level, principal: "public" };
    return next();
  }

  if (!req.user) {
    return next(new ApiError(401, "Authentication required for this tool"));
  }

  if (level === "admin" && req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required for this tool"));
  }

  req.mcpAccess = { level, principal: req.user.role || "user" };
  return next();
};

module.exports = { enforceToolAccess };
