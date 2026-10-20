const express = require("express");
const { signIn } = require("../controllers/userController");
const { loginValidation } = require("../middleware/validationMiddleware");
const { loginLimiter, loginLockout } = require("../middleware/rateLimiterMiddleware");

const router = express.Router();

router.post("/", loginLimiter, loginLockout, loginValidation, signIn);

module.exports = router;
