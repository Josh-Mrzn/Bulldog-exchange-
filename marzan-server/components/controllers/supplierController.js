const Supplier = require("../models/supplierModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, sendError, handleError } = require("../utils/apiResponse");

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 });
    return sendSuccess(res, HttpStatus.OK, "Suppliers retrieved successfully.", suppliers);
  } catch (error) {
    return handleError(res, error);
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return sendError(res, HttpStatus.NOT_FOUND, "Supplier not found");
    return sendSuccess(res, HttpStatus.OK, "Supplier retrieved successfully.", supplier);
  } catch (error) {
    return handleError(res, error);
  }
};

const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    return sendSuccess(res, HttpStatus.CREATED, "Supplier created successfully.", supplier);
  } catch (error) {
    return handleError(res, error);
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!supplier) return sendError(res, HttpStatus.NOT_FOUND, "Supplier not found");
    return sendSuccess(res, HttpStatus.OK, "Supplier updated successfully.", supplier);
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return sendError(res, HttpStatus.NOT_FOUND, "Supplier not found");
    if (await Product.exists({ supplier: supplier._id })) {
      return sendError(res, HttpStatus.CONFLICT, "Cannot delete a supplier that still supplies products");
    }

    await supplier.deleteOne();
    return sendSuccess(res, HttpStatus.OK, "Supplier deleted successfully.", supplier);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
