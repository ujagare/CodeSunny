const ApiError = require("../utils/apiError");

const validate = (schema) => (req, _res, next) => {
  try {
    if (schema.body) req.body = schema.body.parse(req.body);
    if (schema.params) req.params = schema.params.parse(req.params);
    if (schema.query) req.query = schema.query.parse(req.query);
    next();
  } catch (err) {
    next(
      new ApiError(400, "Validation error", {
        issues: err.issues || err.errors || err,
      })
    );
  }
};

module.exports = validate;
