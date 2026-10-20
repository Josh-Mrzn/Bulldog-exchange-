const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, sendError, handleError } = require("../utils/apiResponse");

const orderPopulate = { path: "user", select: "username firstName lastName email" };

// A Customer may only see their own orders; an Admin may see any.
const getOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;
    if (req.query.status) filter.status = req.query.status;

    if (req.user.role !== "Admin") {
      if (filter.user && filter.user !== req.user.id) {
        return sendError(res, HttpStatus.FORBIDDEN, "You can only view your own orders");
      }
      filter.user = req.user.id;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate(orderPopulate);
    return sendSuccess(res, HttpStatus.OK, "Orders retrieved successfully.", orders);
  } catch (error) {
    return handleError(res, error);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(orderPopulate);
    if (!order) return sendError(res, HttpStatus.NOT_FOUND, "Order not found");
    if (req.user.role !== "Admin" && order.user._id.toString() !== req.user.id) {
      return sendError(res, HttpStatus.FORBIDDEN, "You can only view your own orders");
    }
    return sendSuccess(res, HttpStatus.OK, "Order retrieved successfully.", order);
  } catch (error) {
    return handleError(res, error);
  }
};

// A Customer may only place an order for themselves; an Admin may place one for any user.
const createOrder = async (req, res) => {
  try {
    const { items = [], shippingAddress, paymentMethod } = req.body;
    const owner = req.user.role === "Admin" && req.body.user ? req.body.user : req.user.id;
    if (req.user.role !== "Admin" && req.body.user && req.body.user !== req.user.id) {
      return sendError(res, HttpStatus.FORBIDDEN, "You can only place an order for yourself");
    }

    // Copy each product's current title and price so the order keeps the price at checkout
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return sendError(res, HttpStatus.BAD_REQUEST, `Product not found: ${item.product}`);

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      });
    }
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      user: owner,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: Math.round(total * 100) / 100,
    });
    await order.validate();

    if (!(await User.exists({ _id: order.user }))) {
      return sendError(res, HttpStatus.BAD_REQUEST, "User not found");
    }

    await order.save();
    return sendSuccess(res, HttpStatus.CREATED, "Order created successfully.", order);
  } catch (error) {
    return handleError(res, error);
  }
};

// Which status an order may move to next. Delivered and Cancelled are final.
const STATUS_FLOW = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

// PATCH /api/v1/orders/:id
// Admin: move the order along STATUS_FLOW and/or set isPaid.
// Customer: may only cancel their own order, and only while it is still Pending.
const updateOrder = async (req, res) => {
  try {
    const { status, isPaid } = req.body;
    const isAdmin = req.user.role === "Admin";
    if (status === undefined && isPaid === undefined) {
      return sendError(res, HttpStatus.BAD_REQUEST, "Provide a status and/or isPaid to update");
    }
    if (isPaid !== undefined && typeof isPaid !== "boolean") {
      return sendError(res, HttpStatus.BAD_REQUEST, "isPaid must be true or false");
    }
    if (!isAdmin && (status !== "Cancelled" || isPaid !== undefined)) {
      return sendError(res, HttpStatus.FORBIDDEN, "Customers can only cancel their own orders");
    }

    const order = await Order.findById(req.params.id);
    if (!order) return sendError(res, HttpStatus.NOT_FOUND, "Order not found");
    if (!isAdmin) {
      if (order.user.toString() !== req.user.id) {
        return sendError(res, HttpStatus.FORBIDDEN, "You can only cancel your own orders");
      }
      if (order.status === "Cancelled") {
        return sendError(res, HttpStatus.CONFLICT, "This order is already cancelled");
      }
      if (order.status !== "Pending") {
        return sendError(res, HttpStatus.CONFLICT, "This order was already confirmed by the store and can no longer be cancelled");
      }
    }

    if (status !== undefined && status !== order.status) {
      if (!(status in STATUS_FLOW)) {
        return sendError(res, HttpStatus.BAD_REQUEST, `${status} is not a valid order status`);
      }
      if (!STATUS_FLOW[order.status].includes(status)) {
        return sendError(res, HttpStatus.CONFLICT, `An order that is ${order.status} cannot be changed to ${status}`);
      }
      order.status = status;
      if (status === "Cancelled") order.cancelledBy = isAdmin ? "Store" : "Customer";
    }
    if (isPaid !== undefined) order.isPaid = isPaid;

    await order.save();
    await order.populate(orderPopulate);
    return sendSuccess(res, HttpStatus.OK, "Order updated successfully.", order);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getOrders, getOrder, createOrder, updateOrder };
