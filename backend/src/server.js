const path = require("path");
const fs = require("fs");
const express = require("express");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const logger = require("./config/logger");
const errorHandler = require("./middlewares/error.middleware");
const ApiError = require("./utils/apiError");

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

const startServer = async () => {
  validateEnv();
  const allowStartWithoutDb =
    process.env.ALLOW_START_WITHOUT_DB === "true" ||
    (process.env.NODE_ENV !== "production" &&
      process.env.ALLOW_START_WITHOUT_DB !== "false");
  try {
    await connectDB();
  } catch (err) {
    if (!allowStartWithoutDb) throw err;
    logger.warn("Starting without DB connection (ALLOW_START_WITHOUT_DB enabled)");
  }

  const clientRoot = path.resolve(__dirname, "../../");
  const clientDist = path.resolve(__dirname, "../../dist");
  const useViteDevServer = process.env.USE_VITE_DEV_SERVER === "true";

  if (useViteDevServer) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: clientRoot,
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) return next();
      try {
        const url = req.originalUrl;
        const templatePath = path.join(clientRoot, "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (err) {
        vite.ssrFixStacktrace(err);
        next(err);
      }
    });
  } else if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get("*", (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) return next();
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use((_req, _res, next) => {
    next(new ApiError(404, "Route not found"));
  });

  app.use(errorHandler);

  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    logger.info(`ðŸš€ Server running on port ${port}`);
  });

  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
  });
};

startServer();
