const crypto = require("crypto");

let bullmq = null;
let IORedis = null;

try {
  bullmq = require("bullmq");
  IORedis = require("ioredis");
} catch (_err) {
  bullmq = null;
  IORedis = null;
}

const attempts = Number(process.env.MCP_JOB_ATTEMPTS || 3);
const backoffMs = Number(process.env.MCP_JOB_BACKOFF_MS || 2000);
const queueName = process.env.MCP_QUEUE_NAME || "mcp-heavy-jobs";

let mode = "memory";
let initialized = false;
let processor = null;
let loggerRef = null;

let queue = null;
let worker = null;
let connection = null;

const memoryJobs = new Map();

const nowIso = () => new Date().toISOString();
const buildId = () => crypto.randomUUID();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const withTimeout = (promise, ms, message) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message || "Operation timeout")), ms)
    ),
  ]);

const logInfo = (message, extra = {}) => {
  if (loggerRef) loggerRef.info(message, extra);
};

const logWarn = (message, extra = {}) => {
  if (loggerRef) loggerRef.warn(message, extra);
};

const logError = (message, extra = {}) => {
  if (loggerRef) loggerRef.error(message, extra);
};

const runMemoryJob = async (jobId) => {
  const job = memoryJobs.get(jobId);
  if (!job) return;

  job.state = "active";
  job.updatedAt = nowIso();

  for (let attempt = job.attemptsMade + 1; attempt <= job.maxAttempts; attempt += 1) {
    job.attemptsMade = attempt;
    job.updatedAt = nowIso();

    try {
      const result = await processor(job.data);
      job.state = "completed";
      job.result = result;
      job.updatedAt = nowIso();
      memoryJobs.set(jobId, job);
      return;
    } catch (err) {
      job.error = err?.message || "Job failed";
      job.updatedAt = nowIso();
      if (attempt < job.maxAttempts) {
        await delay(backoffMs * attempt);
      }
    }
  }

  job.state = "failed";
  memoryJobs.set(jobId, job);
};

const initialize = async (jobProcessor, logger) => {
  if (initialized) return;
  processor = jobProcessor;
  loggerRef = logger;

  const redisUrl = process.env.REDIS_URL;
  const canUseBull = Boolean(redisUrl && bullmq && IORedis);

  if (!canUseBull) {
    mode = "memory";
    initialized = true;
    logWarn("MCP queue running in memory mode", {
      hasRedisUrl: Boolean(redisUrl),
      bullmqInstalled: Boolean(bullmq),
    });
    return;
  }

  try {
    connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 1500),
    });
    await withTimeout(
      connection.connect(),
      Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 1500),
      "Redis connect timeout"
    );
    await withTimeout(
      connection.ping(),
      Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 1500),
      "Redis ping timeout"
    );
    queue = new bullmq.Queue(queueName, {
      connection,
      defaultJobOptions: {
        attempts,
        backoff: { type: "exponential", delay: backoffMs },
        removeOnComplete: { age: 3600, count: 500 },
        removeOnFail: { age: 86400, count: 1000 },
      },
    });

    worker = new bullmq.Worker(
      queueName,
      async (job) => processor(job.data),
      {
        connection,
        concurrency: Number(process.env.MCP_JOB_CONCURRENCY || 3),
      }
    );

    worker.on("failed", (job, err) => {
      logError("MCP queued job failed", {
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
        error: err?.message,
      });
    });

    worker.on("completed", (job) => {
      logInfo("MCP queued job completed", {
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
      });
    });

    mode = "bullmq";
    initialized = true;
    logInfo("MCP queue initialized", { mode, queueName });
  } catch (err) {
    mode = "memory";
    initialized = true;
    logError("Failed to initialize BullMQ; falling back to memory queue", {
      error: err?.message,
    });
  }
};

const enqueue = async ({ toolName, args, context, meta }) => {
  if (!initialized) throw new Error("Queue service not initialized");

  const trackingToken = buildId();
  const payload = {
    toolName,
    args: args || {},
    context: context || {},
    meta: {
      ...meta,
      trackingToken,
      ownerId: meta?.ownerId || null,
      createdAt: nowIso(),
    },
  };

  if (mode === "bullmq" && queue) {
    const job = await queue.add("mcp_tool", payload);
    return { jobId: String(job.id), trackingToken, mode };
  }

  const jobId = buildId();
  memoryJobs.set(jobId, {
    id: jobId,
    name: "mcp_tool",
    state: "queued",
    data: payload,
    result: null,
    error: null,
    attemptsMade: 0,
    maxAttempts: attempts,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  setImmediate(() => {
    runMemoryJob(jobId).catch((err) => {
      const job = memoryJobs.get(jobId);
      if (job) {
        job.state = "failed";
        job.error = err?.message || "Job failed";
        job.updatedAt = nowIso();
      }
    });
  });

  return { jobId, trackingToken, mode };
};

const getStatus = async (jobId) => {
  if (!initialized) throw new Error("Queue service not initialized");

  if (mode === "bullmq" && queue) {
    const job = await queue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState();
    return {
      id: String(job.id),
      state,
      result: job.returnvalue || null,
      error: job.failedReason || null,
      attemptsMade: job.attemptsMade || 0,
      maxAttempts: job.opts?.attempts || attempts,
      meta: job.data?.meta || {},
      createdAt: job.timestamp ? new Date(job.timestamp).toISOString() : null,
      updatedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
    };
  }

  const job = memoryJobs.get(jobId);
  if (!job) return null;

  return {
    id: job.id,
    state: job.state,
    result: job.result,
    error: job.error,
    attemptsMade: job.attemptsMade,
    maxAttempts: job.maxAttempts,
    meta: job.data?.meta || {},
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
};

module.exports = {
  initialize,
  enqueue,
  getStatus,
  getMode: () => mode,
};
