const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, sendError, handleError } = require("../utils/apiResponse");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return sendSuccess(res, HttpStatus.OK, "Categories retrieved successfully.", categories);
  } catch (error) {
    return handleError(res, error);
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, HttpStatus.NOT_FOUND, "Category not found");
    return sendSuccess(res, HttpStatus.OK, "Category retrieved successfully.", category);
  } catch (error) {
    return handleError(res, error);
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return sendSuccess(res, HttpStatus.CREATED, "Category created successfully.", category);
  } catch (error) {
    return handleError(res, error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!category) return sendError(res, HttpStatus.NOT_FOUND, "Category not found");
    return sendSuccess(res, HttpStatus.OK, "Category updated successfully.", category);
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return sendError(res, HttpStatus.NOT_FOUND, "Category not found");
    if (await Product.exists({ category: category._id })) {
      return sendError(res, HttpStatus.CONFLICT, "Cannot delete a category that still has products");
    }

    await category.deleteOne();
    return sendSuccess(res, HttpStatus.OK, "Category deleted successfully.", category);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
