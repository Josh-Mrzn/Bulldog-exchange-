const rateLimit = require("express-rate-limit");
const { HttpStatus } = require("../config/constants");
const { sendError } = require("../utils/apiResponse");

// Sends the standard { success, message } shape instead of express-rate-limit's default body
const handler = (message) => (req, res) => sendError(res, HttpStatus.TOO_MANY_REQUESTS, message);

// Applied to every route (index.js): a generous ceiling so one client cannot flood the API.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler("Too many requests. Please try again later."),
});

// POST /api/v1/sessions: logging in is the function an attacker gains the most from
// hammering (credential stuffing/brute force), so it gets a much tighter, IP-based limit.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler("Too many login attempts. Please try again after 15 minutes."),
});

// POST /api/v1/users: registration can be abused to spam-create accounts or probe which
// emails already exist, so it is limited per IP as well.
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: handler("Too many accounts created from this address. Please try again after an hour."),
});

// --- Enhancement: escalating lockout per account on repeated failed logins ---------------
// Keyed by email instead of IP, since the point is to protect one account from being
// guessed, no matter which IP the attempts come from. In-memory (a Map), so it is simple,
// needs no schema change, and resets if the server restarts; that tradeoff is fine for a
// single-instance lab project (a shared store, e.g. Redis, would be needed across instances).
const failedLogins = new Map(); // email -> { count, lockedUntil }

// Failed Login: 5x -> 3 minutes, 8x -> 5 minutes, 10x (and beyond) -> 30 minutes, per attempt
const lockoutDuration = (failCount) => {
  if (failCount >= 10) return 30 * 60 * 1000;
  if (failCount >= 8) return 5 * 60 * 1000;
  if (failCount >= 5) return 3 * 60 * 1000;
  return 0;
};

// Runs before the login controller; blocks the request while the account is locked out.
const loginLockout = (req, res, next) => {
  const email = String(req.body.email || "").toLowerCase();
  const entry = failedLogins.get(email);
  if (entry?.lockedUntil && entry.lockedUntil > Date.now()) {
    const minutes = Math.ceil((entry.lockedUntil - Date.now()) / 60000);
    return sendError(res, HttpStatus.TOO_MANY_REQUESTS, `Too many failed login attempts. Try again in ${minutes} minute(s).`);
  }
  next();
};

// Called by the login controller on a wrong password; increases the lockout once the
// failure count crosses 5, 8, or 10 attempts.
const recordLoginFailure = (email) => {
  email = String(email).toLowerCase();
  const entry = failedLogins.get(email) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  const duration = lockoutDuration(entry.count);
  if (duration) entry.lockedUntil = Date.now() + duration;
  failedLogins.set(email, entry);
};

// Called by the login controller on a successful sign-in; clears the account's history.
const recordLoginSuccess = (email) => {
  failedLogins.delete(String(email).toLowerCase());
};

module.exports = { apiLimiter, loginLimiter, registerLimiter, loginLockout, recordLoginFailure, recordLoginSuccess };
