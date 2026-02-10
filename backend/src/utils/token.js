const crypto = require("crypto");

const createTokenPair = (length = 32) => {
  const raw = crypto.randomBytes(length).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
};

module.exports = { createTokenPair };
