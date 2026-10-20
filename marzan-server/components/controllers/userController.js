const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { SALT, SECRET_KEY } = require("../config/config");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, sendError, handleError } = require("../utils/apiResponse");
const { recordLoginFailure, recordLoginSuccess } = require("../middleware/rateLimiterMiddleware");

// POST /api/v1/users - register (public). The role is always "Customer": a client
// can never make itself an Admin by sending role in the request body.
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!password) return sendError(res, HttpStatus.BAD_REQUEST, "Password is required");

    const existingUser = await User.findOne({ email });
    if (existingUser) return sendError(res, HttpStatus.CONFLICT, "Email already registered");

    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, role: "Customer" });

    return sendSuccess(res, HttpStatus.CREATED, "User registered successfully.", {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/v1/sessions - sign in and receive a JWT (public). The role is embedded in the
// token so the authorization middleware can check it without a database lookup.
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return sendError(res, HttpStatus.BAD_REQUEST, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      recordLoginFailure(email);
      return sendError(res, HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
    recordLoginSuccess(email);

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1d" });
    return sendSuccess(res, HttpStatus.OK, "Signed in successfully.", { token });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/v1/users/me - profile of the signed-in user (any role)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return sendError(res, HttpStatus.NOT_FOUND, "User not found");
    return sendSuccess(res, HttpStatus.OK, "Profile retrieved successfully.", user);
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/v1/users - Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return sendSuccess(res, HttpStatus.OK, "Users retrieved successfully.", users);
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/v1/users/:id - Admin only
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return sendError(res, HttpStatus.NOT_FOUND, "User not found");
    return sendSuccess(res, HttpStatus.OK, "User retrieved successfully.", user);
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/v1/users/:id - Admin, or the same signed-in user editing their own account
const updateUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin" && req.user.id !== req.params.id) {
      return sendError(res, HttpStatus.FORBIDDEN, "You can only update your own account");
    }

    const { currentPassword, ...updates } = req.body;
    if (req.user.role !== "Admin") delete updates.role; // only an Admin may change roles

    // Changing your own password needs the current one, so a stolen or forgotten-open session
    // cannot lock the owner out. An Admin resetting someone else's password does not.
    if (updates.password && req.user.id === req.params.id) {
      if (!currentPassword) return sendError(res, HttpStatus.BAD_REQUEST, "Current password is required to set a new one");
      const self = await User.findById(req.params.id);
      if (!self || !(await bcrypt.compare(currentPassword, self.password))) {
        return sendError(res, HttpStatus.BAD_REQUEST, "Current password is incorrect");
      }
    }
    if (updates.password) updates.password = await bcrypt.hash(updates.password, SALT);
    if (updates.username) {
      const taken = await User.exists({ username: updates.username, _id: { $ne: req.params.id } })
        .collation({ locale: "en", strength: 2 });
      if (taken) return sendError(res, HttpStatus.CONFLICT, "That username is already taken");
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");
    if (!user) return sendError(res, HttpStatus.NOT_FOUND, "User not found");
    return sendSuccess(res, HttpStatus.OK, "User updated successfully.", user);
  } catch (error) {
    return handleError(res, error);
  }
};

// DELETE /api/v1/users/:id - Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return sendError(res, HttpStatus.NOT_FOUND, "User not found");
    return sendSuccess(res, HttpStatus.OK, "User deleted successfully.", { _id: user._id, email: user.email });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { signUp, signIn, getProfile, getAllUsers, getUserById, updateUser, deleteUser };
