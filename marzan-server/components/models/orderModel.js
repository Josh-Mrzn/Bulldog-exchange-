const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    title: { type: String, required: [true, "Product title is required"] },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: { validator: Number.isInteger, message: "Quantity must be a whole number" },
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, "Full name is required"], trim: true },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^09\d{9}$/, "Phone number must be 11 digits and start with 09"],
    },
    street: { type: String, required: [true, "Street is required"], trim: true },
    city: { type: String, required: [true, "City is required"], trim: true },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      match: [/^\d{4}$/, "Postal code must be 4 digits"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["Cash on Delivery", "GCash", "Card"],
        message: "{VALUE} is not a valid payment method",
      },
      default: "Cash on Delivery",
    },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "Pending",
    },
    cancelledBy: {
      type: String,
      enum: ["Customer", "Store"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
