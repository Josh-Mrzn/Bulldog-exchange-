const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      required: true,
    },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Audit logs are read far more often by time range than by anything else
logSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Log", logSchema);
