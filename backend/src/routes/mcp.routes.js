const express = require("express");

const router = express.Router();

const MCP_URL = process.env.MCP_URL;
const MCP_PROTOCOL_VERSION = "2025-03-26";

const jsonHeaders = {
  Accept: "application/json, text/event-stream",
  "Content-Type": "application/json",
};

const buildId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const parseJson = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (_err) {
    return { error: { message: "Invalid JSON response", raw: text } };
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

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });

  const sessionId = res.headers.get("mcp-session-id");
  const data = await parseJson(res);

  if (!res.ok || data?.error) {
    return { error: data?.error?.message || "MCP initialize failed" };
  }

  return { sessionId };
};

const callTool = async (toolName, args) => {
  const init = await initializeSession();
  if (init.error) {
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

  let res = await fetch(MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  // If session expired, re-init once.
  if (res.status === 404) {
    const retryInit = await initializeSession();
    if (retryInit.error) {
      return { error: retryInit.error };
    }
    if (retryInit.sessionId) {
      headers["MCP-Session-Id"] = retryInit.sessionId;
    }
    res = await fetch(MCP_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  }

  const data = await parseJson(res);
  if (!res.ok || data?.error) {
    return { error: data?.error?.message || "MCP tool call failed" };
  }

  return { result: data?.result };
};

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.post("/search", async (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: "query is required" });

  const out = await callTool("search", { query });
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  return res.json(JSON.parse(text));
});

router.post("/fetch", async (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "id is required" });

  const out = await callTool("fetch", { id });
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  return res.json(JSON.parse(text));
});

router.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  const out = await callTool("chat", { message });
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  return res.json(JSON.parse(text));
});

router.post("/lead", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const out = await callTool("create_lead", { name, email, message: message || "" });
  if (out.error) return res.status(502).json({ error: out.error });
  const text = out.result?.content?.[0]?.text || "{}";
  return res.json(JSON.parse(text));
});

module.exports = router;
