const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const rateLimiter = require("./middlewares/rateLimiter");
const requestLogger = require("./middlewares/requestLogger");

const app = express();
const useViteDevServer = process.env.USE_VITE_DEV_SERVER === "true";
const isDev = process.env.NODE_ENV !== "production";

app.set("trust proxy", 1);
app.use(
  helmet(
    useViteDevServer && isDev
      ? {
          crossOriginResourcePolicy: { policy: "cross-origin" },
          contentSecurityPolicy: false,
        }
      : {
          crossOriginResourcePolicy: { policy: "cross-origin" },
        }
  )
);

const allowedOrigin = process.env.CORS_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin === "*" ? true : allowedOrigin.split(","),
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(requestLogger);
app.use(xss());
app.use(mongoSanitize());
app.use("/api", rateLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/mcp", require("./routes/mcp.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));

module.exports = app;
