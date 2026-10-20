const { HttpStatus } = require("../config/constants");
const { sendError } = require("../utils/apiResponse");

// Role-Based Access Control: used after authentication, e.g. authorization("Admin").
// Rejects the request unless req.user.role is one of the allowed roles.
const authorization = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, HttpStatus.FORBIDDEN, "Access denied");
    }
    next();
  };
};

module.exports = authorization;
