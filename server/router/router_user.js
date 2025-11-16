const express = require("express");
const router = express.Router();
const controllers = require("../modules/user/controllers");
const { authenticateToken } = require("../middleware/auth");
const { routeLimiter } = require("../middleware/rateLimiters");

router.get(
  "/user/profile",
  routeLimiter(60, 1),
  authenticateToken,
  controllers.user_profile
);

module.exports = router;
