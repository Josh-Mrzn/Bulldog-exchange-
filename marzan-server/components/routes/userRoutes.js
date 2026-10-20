const express = require("express");
const {
  signUp,
  getProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const { registerValidation, updateUserValidation } = require("../middleware/validationMiddleware");
const { registerLimiter } = require("../middleware/rateLimiterMiddleware");

const router = express.Router();

router.post("/", registerLimiter, registerValidation, signUp);
router.get("/me", authentication, getProfile);
router.get("/", authentication, authorization("Admin"), getAllUsers);
router.get("/:id", authentication, authorization("Admin"), getUserById);
router.patch("/:id", authentication, updateUserValidation, updateUser); // Admin, or the same user (checked in the controller)
router.delete("/:id", authentication, authorization("Admin"), deleteUser);

module.exports = router;
