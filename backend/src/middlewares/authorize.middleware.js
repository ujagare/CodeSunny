const ApiError = require("../utils/apiError");

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "Forbidden"));
  }
  return next();
};

module.exports = authorize;
