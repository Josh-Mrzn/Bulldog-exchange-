const Log = require("../models/logModel");

// A tiny logger that writes straight to the Log collection, instead of a file or console
// service, since the project already has MongoDB set up and Atlas makes the logs easy to
// browse (Data Explorer) without adding another dependency.
const logger = {
  info: async (message, metadata = {}) => {
    try {
      await Log.create({ level: "info", message, metadata });
    } catch (error) {
      console.error("Failed to write info log:", error);
    }
  },

  warn: async (message, metadata = {}) => {
    try {
      await Log.create({ level: "warn", message, metadata });
    } catch (error) {
      console.error("Failed to write warn log:", error);
    }
  },

  error: async (message, metadata = {}) => {
    try {
      await Log.create({ level: "error", message, metadata });
    } catch (error) {
      console.error("Failed to write error log:", error);
    }
  },
};

// Logs every request: who made it (if signed in), what they asked for, how the server
// answered, and how long it took. Mounted before the routes, so it covers every response,
// including 404s and errors from the centralized error handler.
const auditLoggerMiddleware = (request, response, next) => {
  const startTime = Date.now();

  // res.json() calls res.send() internally, so wrapping send() also covers every
  // sendSuccess()/sendError() response built with this project's apiResponse helper.
  const originalSend = response.send;
  response.send = async function (data) {
    response.send = originalSend;

    const duration = Date.now() - startTime;
    const logData = {
      method: request.method,
      // originalUrl, not path: Express strips the mount-point prefix from req.path/req.url
      // while a request is inside a nested router (e.g. categoryRoutes), and only restores
      // it after the handler finishes — but this runs from inside the handler's own
      // response.send(), before that restore happens, so req.path would be truncated
      // (e.g. "/:id" instead of "/api/v1/categories/:id"). originalUrl is never rewritten.
      path: request.originalUrl,
      ip: request.ip || request.connection.remoteAddress,
      userId: request.user?.id || null,
      email: request.user?.email || null,
      role: request.user?.role || null,
      statusCode: response.statusCode,
      metadata: { duration: `${duration}ms` },
    };

    // Awaited (unlike the fire-and-forget style in the reference example) so the log is
    // guaranteed to exist before the client sees the response, instead of racing it.
    const message = `${logData.method} ${logData.path} - ${logData.statusCode}`;
    if (response.statusCode >= 500) {
      await logger.error(message, logData);
    } else if (response.statusCode >= 400) {
      await logger.warn(message, logData);
    } else {
      await logger.info(message, logData);
    }

    return response.send(data);
  };

  next();
};

module.exports = { logger, auditLoggerMiddleware };
