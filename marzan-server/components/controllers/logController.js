const Log = require("../models/logModel");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, handleError } = require("../utils/apiResponse");

// GET /api/v1/logs - Admin only. Lets the audit log be checked from Postman directly,
// instead of needing to open MongoDB Atlas, with the newest entries first.
const getLogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.level) filter.level = req.query.level;

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const logs = await Log.find(filter).sort({ createdAt: -1 }).limit(limit);
    return sendSuccess(res, HttpStatus.OK, "Logs retrieved successfully.", logs);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getLogs };
