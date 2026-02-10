const required = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

module.exports = { validateEnv };
