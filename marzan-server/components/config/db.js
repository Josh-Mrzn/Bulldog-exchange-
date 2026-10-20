const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL);
    console.log("MongoDB connected");
    console.log(`Models loaded: ${mongoose.modelNames().join(", ")}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
