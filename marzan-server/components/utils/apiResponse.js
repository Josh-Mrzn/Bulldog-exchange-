const { HttpStatus } = require("../config/constants");

// Every response uses the same shape: { success, message, count (lists only), ...meta, data }
const sendSuccess = (res, statusCode, message, data, meta = {}) => {
  const body = { success: true, message };
  if (Array.isArray(data)) body.count = data.length;
  return res.status(statusCode).json({ ...body, ...meta, data });
};

const sendError = (res, statusCode, message) => res.status(statusCode).json({ success: false, message });

// Maps Mongoose and MongoDB errors to the matching HTTP status code
const handleError = (res, error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return sendError(res, HttpStatus.BAD_REQUEST, error.message);
  }
  if (error.code === 11000) {
    const [field, value] = Object.entries(error.keyValue || {})[0] || ["value", ""];
    return sendError(res, HttpStatus.CONFLICT, `${field} "${value}" already exists`);
  }
  console.error(error);
  return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong on the server");
};

module.exports = { sendSuccess, sendError, handleError };
