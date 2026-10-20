const Review = require("../models/reviewModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, sendError, handleError } = require("../utils/apiResponse");

const reviewPopulate = [
  { path: "user", select: "username firstName lastName" },
  { path: "product", select: "title" },
];

// Reviews are public: any shopper can read them, signed in or not.
const getReviews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.product) filter.product = req.query.product;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).populate(reviewPopulate);
    return sendSuccess(res, HttpStatus.OK, "Reviews retrieved successfully.", reviews);
  } catch (error) {
    return handleError(res, error);
  }
};

const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate(reviewPopulate);
    if (!review) return sendError(res, HttpStatus.NOT_FOUND, "Review not found");
    return sendSuccess(res, HttpStatus.OK, "Review retrieved successfully.", review);
  } catch (error) {
    return handleError(res, error);
  }
};

// A Customer may only post a review as themselves; an Admin may post one on behalf of any user.
const createReview = async (req, res) => {
  try {
    const owner = req.user.role === "Admin" && req.body.user ? req.body.user : req.user.id;
    if (req.user.role !== "Admin" && req.body.user && req.body.user !== req.user.id) {
      return sendError(res, HttpStatus.FORBIDDEN, "You can only post a review as yourself");
    }

    const review = new Review({ ...req.body, user: owner });
    await review.validate();

    if (!(await User.exists({ _id: review.user }))) {
      return sendError(res, HttpStatus.BAD_REQUEST, "User not found");
    }
    if (!(await Product.exists({ _id: review.product }))) {
      return sendError(res, HttpStatus.BAD_REQUEST, "Product not found");
    }
    if (await Review.exists({ user: review.user, product: review.product })) {
      return sendError(res, HttpStatus.CONFLICT, "This user already reviewed this product");
    }

    await review.save();
    return sendSuccess(res, HttpStatus.CREATED, "Review created successfully.", review);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getReviews, getReview, createReview };
