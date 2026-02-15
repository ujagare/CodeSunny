const crypto = require("crypto");

module.exports = (req, res, next) => {
  const incoming = req.headers["x-request-id"];
  const requestId =
    (typeof incoming === "string" && incoming.trim()) || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};
