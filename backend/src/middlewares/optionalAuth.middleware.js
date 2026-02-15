const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

module.exports = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(err instanceof ApiError ? err : new ApiError(401, "Invalid token"));
  }
};
