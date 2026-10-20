const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, sendError, handleError } = require("../utils/apiResponse");

const cartPopulate = [
  { path: "user", select: "firstName lastName email" },
  { path: "items.product", select: "title price stock" },
];

// A Customer may only see their own cart(s); an Admin may see any.
const getCarts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;

    if (req.user.role !== "Admin") {
      if (filter.user && filter.user !== req.user.id) {
        return sendError(res, HttpStatus.FORBIDDEN, "You can only view your own cart");
      }
      filter.user = req.user.id;
    }

    const carts = await Cart.find(filter).populate(cartPopulate);
    return sendSuccess(res, HttpStatus.OK, "Carts retrieved successfully.", carts);
  } catch (error) {
    return handleError(res, error);
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate(cartPopulate);
    if (!cart) return sendError(res, HttpStatus.NOT_FOUND, "Cart not found");
    if (req.user.role !== "Admin" && cart.user._id.toString() !== req.user.id) {
      return sendError(res, HttpStatus.FORBIDDEN, "You can only view your own cart");
    }
    return sendSuccess(res, HttpStatus.OK, "Cart retrieved successfully.", cart);
  } catch (error) {
    return handleError(res, error);
  }
};

// A Customer may only create a cart for themselves; an Admin may create one for any user.
const createCart = async (req, res) => {
  try {
    const owner = req.user.role === "Admin" && req.body.user ? req.body.user : req.user.id;
    if (req.user.role !== "Admin" && req.body.user && req.body.user !== req.user.id) {
      return sendError(res, HttpStatus.FORBIDDEN, "You can only create a cart for yourself");
    }

    const cart = new Cart({ ...req.body, user: owner });
    await cart.validate();

    if (!(await User.exists({ _id: cart.user }))) {
      return sendError(res, HttpStatus.BAD_REQUEST, "User not found");
    }
    if (await Cart.exists({ user: cart.user })) {
      return sendError(res, HttpStatus.CONFLICT, "This user already has a cart");
    }
    for (const item of cart.items) {
      if (!(await Product.exists({ _id: item.product }))) {
        return sendError(res, HttpStatus.BAD_REQUEST, `Product not found: ${item.product}`);
      }
    }

    await cart.save();
    return sendSuccess(res, HttpStatus.CREATED, "Cart created successfully.", cart);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getCarts, getCart, createCart };
