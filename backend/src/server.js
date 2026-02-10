const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const logger = require("./config/logger");

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

const startServer = async () => {
  validateEnv();
  await connectDB();

  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    logger.info(`🚀 Server running on port ${port}`);
  });

  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Rejection:", err);
    server.close(() => process.exit(1));
  });
};

startServer();
