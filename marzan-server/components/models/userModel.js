const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Optional public display name; any characters except whitespace, so "Josh_M!" or "jm★" are fine.
    username: {
      type: String,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [/^\S+$/, "Username cannot contain spaces"],
    },
    firstName: { type: String, required: [true, "First name is required"], trim: true },
    lastName: { type: String, required: [true, "Last name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: {
        values: ["Customer", "Admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "Customer",
      required: true,
    },
  },
  { timestamps: true }
);

// Unique ignoring letter case ("Josh" and "josh" clash); sparse because older accounts have none.
userSchema.index({ username: 1 }, { unique: true, sparse: true, collation: { locale: "en", strength: 2 } });

module.exports = mongoose.model("User", userSchema);
