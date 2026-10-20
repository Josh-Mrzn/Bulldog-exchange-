const { body, validationResult } = require("express-validator");
const { HttpStatus } = require("../config/constants");
const { sendError } = require("../utils/apiResponse");

// Rejects the request before it reaches the controller if any rule above it failed,
// in this project's standard { success, message } error format instead of
// express-validator's raw { errors: [...] } shape.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join("; ");
    return sendError(res, HttpStatus.BAD_REQUEST, message);
  }
  next();
};

// POST /api/v1/users - matches userModel's required fields (firstName, lastName, email, password)
const registerValidation = [
  body("firstName").isString().withMessage("First name must be a string").trim().notEmpty().withMessage("First name is required"),
  body("lastName").isString().withMessage("Last name must be a string").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  handleValidation,
];

// POST /api/v1/sessions
const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

// PATCH /api/v1/users/:id - every field is optional since only changed fields are sent
const updateUserValidation = [
  body("username")
    .optional()
    .isString().withMessage("Username must be a string")
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3 to 30 characters long")
    .matches(/^\S+$/).withMessage("Username cannot contain spaces"),
  body("firstName").optional().isString().trim().notEmpty().withMessage("First name cannot be empty"),
  body("lastName").optional().isString().trim().notEmpty().withMessage("Last name cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("currentPassword").optional().isString().withMessage("Current password must be a string"),
  handleValidation,
];

module.exports = { registerValidation, loginValidation, updateUserValidation };
