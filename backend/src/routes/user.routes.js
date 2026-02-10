const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/authorize.middleware");
const { getMe, adminPing } = require("../controllers/user.controller");

router.get("/me", auth, getMe);
router.get("/admin/ping", auth, authorize("admin"), adminPing);

module.exports = router;
