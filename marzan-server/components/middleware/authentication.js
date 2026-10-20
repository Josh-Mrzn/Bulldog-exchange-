const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");
const { HttpStatus } = require("../config/constants");
const { sendError } = require("../utils/apiResponse");

// Verifies the JWT sent in the Authorization: Bearer <token> header and attaches
// its payload (id, email, role) to req.user so later middleware/controllers can use it.
const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, HttpStatus.UNAUTHORIZED, "No token provided");
  }

  try {
    req.user = jwt.verify(authHeader.split(" ")[1], SECRET_KEY);
    next();
  } catch (error) {
    sendError(res, HttpStatus.UNAUTHORIZED, "Invalid or expired token");
  }
};

module.exports = authentication;
