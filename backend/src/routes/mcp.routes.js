const express = require("express");
const axios = require("axios");
const logger = require("../config/logger");
const optionalAuth = require("../middlewares/optionalAuth.middleware");
const { enforceToolAccess } = require("../middlewares/mcpToolAccess.middleware");
const mcpQueue = require("../services/mcpQueue.service");

const router = express.Router();
router.use(optionalAuth);

const MCP_URL = process.env.MCP_URL || "http://localhost:8000/mcp";
const MCP_PROTOCOL_VERSION = "2025-03-26";

const jsonHeaders = {
  Accept: "application/json, text/event-stream",
  "Content-Type": "application/json",
};
const isHttpOk = (status) => status >= 200 && status < 300;

const buildId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const queueableTools = new Set([
  "seo_audit",
  "generate_proposal_pdf",
  "generate_image",
  "check_server_health",
  "get_analytics_summary",
  "generate_payment_link_razorpay",
]);

let queueInitPromise = null;
const parseToolPayload = (text) => {
  try {
    return JSON.parse(text || "{}");
  } catch (_err) {
    return { error: "Invalid tool payload" };
  }
};

const parseMcpResponse = (text) => {
  const raw = typeof text === "string" ? text : JSON.stringify(text || "");
  const trimmed = raw.trim();

  if (!trimmed) return {};

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch (_err) {
      return { error: { message: "Invalid JSON response", raw } };
    }
  }

  // Streamable HTTP can return event-stream payloads with "data:" lines.
  const dataLines = trimmed
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter(Boolean);

  for (let i = dataLines.length - 1; i >= 0; i -= 1) {
    const chunk = dataLines[i];
    if (chunk === "[DONE]") continue;
    try {
      return JSON.parse(chunk);
    } catch (_err) {
      // Continue scanning previous chunks.
    }
  }

  try {
    return JSON.parse(trimmed);
  } catch (_err) {
    return { error: { message: "Invalid JSON response", raw } };
  }
};

const initializeSession = async () => {
  if (!MCP_URL) {
    return { error: "MCP_URL is not configured" };
  }
  const payload = {
    jsonrpc: "2.0",
    id: `init-${buildId()}`,
    method: "initialize",
    params: {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {
        tools: { listChanged: false },
      },
      clientInfo: {
        name: "codesunny-web",
        version: "1.0.0",
      },
    },
  };

  try {
    console.log("Initializing MCP session at:", MCP_URL);
    const res = await axios.post(MCP_URL, payload, {
      headers: {
        ...jsonHeaders,
        "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
      },
      responseType: "text",
      transformResponse: [(v) => v],
      validateStatus: () => true,
    });

    const sessionId = res.headers["mcp-session-id"];
    const data = parseMcpResponse(res.data);

    console.log("MCP init response status:", res.status);
    console.log("MCP init response data:", data);

    if (!isHttpOk(res.status) || data?.error) {
      return { error: data?.error?.message || "MCP initialize failed" };
    }

    if (sessionId) {
      const initializedPayload = {
        jsonrpc: "2.0",
        method: "notifications/initialized",
        params: {},
      };
      await axios.post(MCP_URL, initializedPayload, {
        headers: {
          ...jsonHeaders,
          "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
          "MCP-Session-Id": sessionId,
        },
        responseType: "text",
        transformResponse: [(v) => v],
        validateStatus: () => true,
      });
    }

    return { sessionId };
  } catch (error) {
    console.error("MCP initialization error:", error);
    return { error: `Failed to connect to MCP server: ${error.message}` };
  }
};

const callTool = async (toolName, args, context = {}) => {
  const startedAt = Date.now();
  const reqId = context.requestId || "unknown";
  const userId = context.userId || "anonymous";

  const init = await initializeSession();
  if (init.error) {
    logger.warn("MCP tool initialization failed", {
      requestId: reqId,
      userId,
      toolName,
      error: init.error,
    });
    return { error: init.error };
  }

  const payload = {
    jsonrpc: "2.0",
    id: `call-${buildId()}`,
    method: "tools/call",
    params: {
      name: toolName,
      arguments: args || {},
    },
  };

  const headers = {
    ...jsonHeaders,
    "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
  };
  if (init.sessionId) {
    headers["MCP-Session-Id"] = init.sessionId;
  }

  let res;
  try {
    res = await axios.post(MCP_URL, payload, {
      headers: { ...headers, "x-request-id": reqId },
      responseType: "text",
      transformResponse: [(v) => v],
      validateStatus: () => true,
    });
  } catch (err) {
    logger.error("MCP tool call transport error", {
      requestId: reqId,
      userId,
      toolName,
      durationMs: Date.now() - startedAt,
      error: err.message,
    });
    return { error: `MCP request failed: ${err.message}` };
  }

  // If session expired, re-init once.
  if (res.status === 404) {
    const retryInit = await initializeSession();
    if (retryInit.error) {
      return { error: retryInit.error };
    }
    if (retryInit.sessionId) {
      headers["MCP-Session-Id"] = retryInit.sessionId;
    }
    res = await axios.post(MCP_URL, payload, {
      headers: { ...headers, "x-request-id": reqId },
      responseType: "text",
      transformResponse: [(v) => v],
      validateStatus: () => true,
    });
  }

  const data = parseMcpResponse(res.data);
  if (!isHttpOk(res.status) || data?.error) {
    logger.warn("MCP tool call failed", {
      requestId: reqId,
      userId,
      toolName,
      durationMs: Date.now() - startedAt,
      statusCode: res.status,
      error: data?.error?.message || "MCP tool call failed",
    });
    return { error: data?.error?.message || "MCP tool call failed" };
  }

  logger.info("MCP tool call success", {
    requestId: reqId,
    userId,
    toolName,
    durationMs: Date.now() - startedAt,
    statusCode: res.status,
  });

  return { result: data?.result };
};

const callToolAndParse = async (toolName, args, context = {}) => {
  const out = await callTool(toolName, args, context);
  if (out.error) return { error: out.error };
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return { error: payload.error };
  return { payload };
};

const mcpContext = (req) => ({
  requestId: req.requestId,
  userId: req.user?._id?.toString?.() || "anonymous",
});

const ensureQueueInitialized = () => {
  if (!queueInitPromise) {
    queueInitPromise = mcpQueue.initialize(async (jobData) => {
      const out = await callTool(
        jobData.toolName,
        jobData.args || {},
        jobData.context || {}
      );
      if (out.error) {
        throw new Error(out.error);
      }
      const text = out.result?.content?.[0]?.text || "{}";
      const payload = parseToolPayload(text);
      if (payload?.error) {
        throw new Error(payload.error);
      }
      return payload;
    }, logger);
  }
  return queueInitPromise;
};

const isAsyncRequested = (req) => {
  const q = String(req.query?.async || "").toLowerCase();
  if (q === "1" || q === "true" || q === "yes") return true;
  return req.body?.async === true;
};

const queueToolIfRequested = async (req, res, toolName, args) => {
  if (!queueableTools.has(toolName)) return false;
  if (!isAsyncRequested(req)) return false;

  await ensureQueueInitialized();

  const ownerId = req.user?._id?.toString?.() || null;
  const enqueued = await mcpQueue.enqueue({
    toolName,
    args,
    context: mcpContext(req),
    meta: {
      ownerId,
      route: req.originalUrl,
      requestId: req.requestId,
    },
  });

  return res.status(202).json({
    queued: true,
    job_id: enqueued.jobId,
    status_url: `/api/mcp/jobs/${enqueued.jobId}`,
    tracking_token: enqueued.trackingToken,
    queue_mode: enqueued.mode,
  });
};

const canReadJob = (req, job) => {
  const token =
    req.query?.token ||
    req.headers["x-job-token"] ||
    req.headers["x-tracking-token"];
  const ownerId = job?.meta?.ownerId || null;
  const userId = req.user?._id?.toString?.() || null;
  const isAdmin = req.user?.role === "admin";

  if (isAdmin) return true;
  if (ownerId && userId && ownerId === userId) return true;
  if (token && token === job?.meta?.trackingToken) return true;
  return false;
};

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/jobs/:jobId", async (req, res) => {
  await ensureQueueInitialized();
  const { jobId } = req.params;
  const job = await mcpQueue.getStatus(jobId);
  if (!job) {
    return res.status(404).json({ error: "job_not_found" });
  }
  if (!canReadJob(req, job)) {
    return res.status(403).json({
      error: "forbidden",
      message: "Provide valid tracking token or owner credentials",
    });
  }

  return res.json({
    job_id: job.id,
    state: job.state,
    attempts_made: job.attemptsMade,
    max_attempts: job.maxAttempts,
    queue_mode: mcpQueue.getMode(),
    created_at: job.createdAt,
    updated_at: job.updatedAt,
    result: job.result,
    error: job.error,
  });
});

router.post("/search", enforceToolAccess("search"), async (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: "query is required" });

  const out = await callTool("search", { query }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post("/fetch", enforceToolAccess("fetch"), async (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "id is required" });

  const out = await callTool("fetch", { id }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post("/chat", enforceToolAccess("chat"), async (req, res) => {
  const { message, session_id } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  // Pass session_id to MCP server
  const out = await callTool("chat", {
    message: message,
    session_id: session_id || "",
  }, mcpContext(req));
  console.log("MCP callTool result:", JSON.stringify(out, null, 2)); // Debug

  if (out.error) return res.status(502).json({ error: out.error });

  // MCP returns content array with text field containing JSON
  const text = out.result?.content?.[0]?.text || "{}";
  console.log("Extracted text:", text); // Debug

  const payload = parseToolPayload(text);
  console.log("Parsed payload:", payload); // Debug

  // Check if parsing was successful
  if (payload?.error) return res.status(502).json({ error: payload.error });

  // Check if payload has nested content (double-wrapped)
  if (payload?.content?.[0]?.text) {
    // Parse the inner JSON
    try {
      const innerPayload = parseToolPayload(payload.content[0].text);
      console.log("Inner payload:", innerPayload); // Debug
      return res.json(innerPayload);
    } catch (e) {
      console.error("Failed to parse inner payload:", e);
      return res.json(payload);
    }
  }

  // Return the parsed payload (should have 'reply' and 'session_id' fields)
  return res.json(payload);
});

router.post("/lead", enforceToolAccess("create_lead"), async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const out = await callTool("create_lead", {
    name,
    email,
    message: message || "",
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post("/web-search", enforceToolAccess("web_search"), async (req, res) => {
  const { query, maxResults } = req.body || {};
  if (!query) {
    return res.status(400).json({ error: "query is required" });
  }

  const out = await callTool("web_search", {
    query,
    max_results: maxResults || 5,
  }, mcpContext(req));

  if (out.error) return res.status(502).json({ error: out.error });

  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);

  if (payload?.error) {
    return res.status(502).json({
      error: payload.error,
      message: payload.message,
      instructions: payload.instructions,
    });
  }

  return res.json(payload);
});

router.post("/quote", enforceToolAccess("calculate_quote"), async (req, res) => {
  const { services, requirements } = req.body || {};
  if (!services) {
    return res.status(400).json({ error: "services is required" });
  }

  const out = await callTool("calculate_quote", {
    services,
    requirements: requirements || "",
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post("/seo-audit", enforceToolAccess("seo_audit"), async (req, res) => {
  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: "url is required" });
  }
  const queued = await queueToolIfRequested(req, res, "seo_audit", { url });
  if (queued) return;

  const out = await callTool("seo_audit", { url }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post("/cloud-calculator", enforceToolAccess("cloud_calculator"), async (req, res) => {
  const { traffic, storage, region } = req.body || {};
  if (!traffic) {
    return res.status(400).json({ error: "traffic is required" });
  }

  const out = await callTool("cloud_calculator", {
    traffic,
    storage: storage || "50GB",
    region: region || "asia",
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post("/schedule-meeting", enforceToolAccess("schedule_consultation_google"), async (req, res) => {
  const { name, email, preferred_datetime, timezone, notes } = req.body || {};
  const out = await callToolAndParse("schedule_consultation_google", {
    name: name || "",
    email: email || "",
    preferred_datetime: preferred_datetime || "",
    timezone: timezone || "Asia/Kolkata",
    notes: notes || "",
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  return res.json(out.payload);
});

router.post("/proposal", enforceToolAccess("generate_proposal_pdf"), async (req, res) => {
  const { client_name, client_email, services, total_amount, timeline, send_email } =
    req.body || {};
  if (!client_name || !client_email || !services || !total_amount) {
    return res.status(400).json({
      error: "client_name, client_email, services, total_amount are required",
    });
  }
  const proposalArgs = {
    client_name,
    client_email,
    services,
    total_amount,
    timeline: timeline || "8-12 weeks",
    send_email: typeof send_email === "boolean" ? send_email : true,
  };
  const queued = await queueToolIfRequested(
    req,
    res,
    "generate_proposal_pdf",
    proposalArgs
  );
  if (queued) return;

  const out = await callToolAndParse("generate_proposal_pdf", {
    ...proposalArgs,
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  return res.json(out.payload);
});

router.post("/lead-stage", enforceToolAccess("update_lead_stage"), async (req, res) => {
  const { lead_email, new_stage, notes } = req.body || {};
  if (!lead_email || !new_stage) {
    return res.status(400).json({ error: "lead_email and new_stage are required" });
  }
  const out = await callToolAndParse("update_lead_stage", {
    lead_email,
    new_stage,
    notes: notes || "",
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  return res.json(out.payload);
});

router.get("/pipeline-stats", enforceToolAccess("crm_pipeline_manager"), async (req, res) => {
  const out = await callToolAndParse("crm_pipeline_manager", {
    action: "get_stats",
    lead_id: "",
    stage: "",
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  return res.json(out.payload);
});

router.post("/dashboard-summary", enforceToolAccess("client_dashboard_summary"), async (req, res) => {
  const { client_email } = req.body || {};
  if (!client_email) {
    return res.status(400).json({ error: "client_email is required" });
  }
  const queued = await queueToolIfRequested(req, res, "client_dashboard_summary", {
    client_email,
  });
  if (queued) return;
  const out = await callToolAndParse("client_dashboard_summary", { client_email }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  return res.json(out.payload);
});

router.post("/health-check", enforceToolAccess("check_server_health"), async (req, res) => {
  const { domain } = req.body || {};
  if (!domain) {
    return res.status(400).json({ error: "domain is required" });
  }
  const queued = await queueToolIfRequested(req, res, "check_server_health", {
    domain,
  });
  if (queued) return;
  const out = await callToolAndParse("check_server_health", { domain }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  return res.json(out.payload);
});

router.post("/project-status", enforceToolAccess("project_status"), async (req, res) => {
  const { client_name, project_id } = req.body || {};

  const out = await callTool("project_status", {
    client_name: client_name || "",
    project_id: project_id || "",
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post("/generate-image", enforceToolAccess("generate_image"), async (req, res) => {
  const { prompt, style, size } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }
  const imageArgs = {
    prompt,
    style: style || "realistic",
    size: size || "1024x1024",
  };
  const queued = await queueToolIfRequested(req, res, "generate_image", imageArgs);
  if (queued) return;

  const out = await callTool("generate_image", {
    ...imageArgs,
  }, mcpContext(req));
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  const payload = parseToolPayload(text);
  if (payload?.error) return res.status(502).json({ error: payload.error });
  return res.json(payload);
});

router.post(
  "/analytics-summary",
  enforceToolAccess("get_analytics_summary"),
  async (req, res) => {
    const { period } = req.body || {};
    const args = { period: period || "30days" };
    const queued = await queueToolIfRequested(
      req,
      res,
      "get_analytics_summary",
      args
    );
    if (queued) return;

    const out = await callTool("get_analytics_summary", args, mcpContext(req));
    if (out.error) return res.status(502).json({ error: out.error });
    const text = out.result?.content?.[0]?.text || "{}";
    const payload = parseToolPayload(text);
    if (payload?.error) return res.status(502).json({ error: payload.error });
    return res.json(payload);
  }
);

router.post(
  "/payment-link-razorpay",
  enforceToolAccess("generate_payment_link_razorpay"),
  async (req, res) => {
    const { client_name, client_email, amount, description, currency } =
      req.body || {};
    if (!client_name || !client_email || !amount) {
      return res
        .status(400)
        .json({ error: "client_name, client_email, amount are required" });
    }

    const args = {
      client_name,
      client_email,
      amount: Number(amount),
      description: description || "Project Payment",
      currency: currency || "INR",
    };

    const queued = await queueToolIfRequested(
      req,
      res,
      "generate_payment_link_razorpay",
      args
    );
    if (queued) return;

    const out = await callTool("generate_payment_link_razorpay", args, mcpContext(req));
    if (out.error) return res.status(502).json({ error: out.error });
    const text = out.result?.content?.[0]?.text || "{}";
    const payload = parseToolPayload(text);
    if (payload?.error) return res.status(502).json({ error: payload.error });
    return res.json(payload);
  }
);

router.get("/unsubscribe", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2>❌ Invalid Request</h2>
          <p>Email parameter is missing.</p>
        </body>
      </html>
    `);
  }

  try {
    // Load leads file
    const fs = require("fs");
    const path = require("path");
    const leadsPath = path.join(
      __dirname,
      "../../../mcp-server/data/leads.json",
    );

    if (!fs.existsSync(leadsPath)) {
      throw new Error("Leads file not found");
    }

    const leads = JSON.parse(fs.readFileSync(leadsPath, "utf8"));

    // Find and update lead
    let found = false;
    for (let lead of leads) {
      if (lead.email === email) {
        lead.unsubscribed = true;
        lead.unsubscribed_at = new Date().toISOString() + "Z";
        found = true;
        break;
      }
    }

    // Save updated leads
    fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));

    // Return success page
    return res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              background: white;
              color: #333;
              padding: 40px;
              border-radius: 10px;
              max-width: 500px;
              margin: 0 auto;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h2 { color: #2563eb; }
            .success { color: #10b981; font-size: 48px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✅</div>
            <h2>Successfully Unsubscribed</h2>
            <p>You have been unsubscribed from CodeSunny emails.</p>
            <p style="color: #666; font-size: 14px;">Email: ${email}</p>
            <p style="margin-top: 30px;">
              <a href="https://codesunny.com" style="color: #2563eb; text-decoration: none;">← Back to CodeSunny</a>
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return res.status(500).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2>❌ Error</h2>
          <p>Failed to process unsubscribe request.</p>
          <p style="color: #666;">Please contact: information@codesunny.in</p>
        </body>
      </html>
    `);
  }
});

module.exports = router;
