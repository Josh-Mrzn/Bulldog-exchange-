const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const { PORT, CORS_ORIGIN } = require("./components/config/config");
const { HttpStatus } = require("./components/config/constants");
const connectDB = require("./components/config/db");
const { sendSuccess, sendError } = require("./components/utils/apiResponse");
const { auditLoggerMiddleware } = require("./components/middleware/auditLoggerMiddleware");
const { apiLimiter } = require("./components/middleware/rateLimiterMiddleware");
const productRoutes = require("./components/routes/productRoutes");
const categoryRoutes = require("./components/routes/categoryRoutes");
const supplierRoutes = require("./components/routes/supplierRoutes");
const userRoutes = require("./components/routes/userRoutes");
const sessionRoutes = require("./components/routes/sessionRoutes");
const cartRoutes = require("./components/routes/cartRoutes");
const orderRoutes = require("./components/routes/orderRoutes");
const reviewRoutes = require("./components/routes/reviewRoutes");
const logRoutes = require("./components/routes/logRoutes");

const app = express();

// On Vercel every request comes through its proxy; trusting one hop makes req.ip the real
// client IP (used by the rate limiters). Not set locally, where X-Forwarded-For could be faked.
if (process.env.VERCEL) app.set("trust proxy", 1);

// This is a JSON-only API (no pages or inline scripts rendered by this server), so the
// Content-Security-Policy can start from "nothing is allowed" instead of Helmet's default,
// which still assumes an app that might serve HTML.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// Only the configured frontend origin(s) (CORS_ORIGIN in .env) may call this API from a
// browser; Postman and curl are not subject to CORS, so this does not affect API testing.
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Accept", "Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use((req, res, next) => {
  req.body ??= {}; // Express 5 leaves req.body undefined when no JSON body is sent
  next();
});

// Logs every request/response (see components/middleware/auditLoggerMiddleware.js). Placed
// before the rate limiter so a 429 is logged too, and before the routes so it is mounted
// for every one of them, authenticated or not.
app.use(auditLoggerMiddleware);
app.use(apiLimiter);

app.get("/", (req, res) => {
  sendSuccess(res, HttpStatus.OK, "BulldogEx Shop API is running", { version: "v1" });
});

const API_V1 = "/api/v1";
app.use(`${API_V1}/products`, productRoutes);
app.use(`${API_V1}/categories`, categoryRoutes);
app.use(`${API_V1}/suppliers`, supplierRoutes);
app.use(`${API_V1}/users`, userRoutes);
app.use(`${API_V1}/sessions`, sessionRoutes);
app.use(`${API_V1}/carts`, cartRoutes);
app.use(`${API_V1}/orders`, orderRoutes);
app.use(`${API_V1}/reviews`, reviewRoutes);
app.use(`${API_V1}/logs`, logRoutes);

// Unknown routes
app.use((req, res) => {
  sendError(res, HttpStatus.NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found`);
});

// Invalid JSON bodies, bad file uploads, and unexpected errors
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return sendError(res, HttpStatus.BAD_REQUEST, "Request body is not valid JSON");
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be 5 MB or smaller" : err.message;
    return sendError(res, HttpStatus.BAD_REQUEST, message);
  }
  if (err.message === "Only JPEG, PNG, or WebP image files are allowed.") {
    return sendError(res, HttpStatus.BAD_REQUEST, err.message);
  }
  console.error(err);
  sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong on the server");
});

// On Vercel the exported app handles each request, so only local runs need to listen on a port.
connectDB().then(() => {
  if (!process.env.VERCEL) app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});

module.exports = app;
