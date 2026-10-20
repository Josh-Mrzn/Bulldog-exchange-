require("dotenv").config();

const MONGO_DB_URL = process.env.MONGODB_CONNECTION_STRING;
const SALT = parseInt(process.env.SALT);
const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 5000;
// Comma-separated list of origins allowed to call this API (the React frontend's dev
// server and, once deployed, its Vercel URL). Falls back to common local dev ports.
const CORS_ORIGIN = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  MONGO_DB_URL,
  SALT,
  SECRET_KEY,
  PORT,
  CORS_ORIGIN,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
