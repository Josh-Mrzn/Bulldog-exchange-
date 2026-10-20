const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Supplier = require("../models/supplierModel");
const cloudinary = require("../config/cloudinary");
const { HttpStatus } = require("../config/constants");
const { sendSuccess, sendError, handleError } = require("../utils/apiResponse");

// req.file.buffer (memoryStorage) is streamed straight to Cloudinary; nothing touches disk.
const uploadBufferToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });

const SORTABLE_FIELDS = ["price", "title", "name", "createdAt"];
const NO_MATCH = { $in: [] }; // filter value that matches no document
const productPopulate = [
  { path: "category", select: "name" },
  { path: "supplier", select: "name" },
];

// Accepts an ObjectId or a name (case-insensitive) and returns the document's _id, or null
const findIdByName = async (Model, value) => {
  const query = mongoose.isObjectIdOrHexString(value) ? { _id: value } : { name: value };
  const doc = await Model.findOne(query).collation({ locale: "en", strength: 2 }).select("_id");
  return doc ? doc._id : null;
};

const findMissingReference = async ({ category, supplier }) => {
  if (category && !(await Category.exists({ _id: category }))) return "Category not found";
  if (supplier && !(await Supplier.exists({ _id: supplier }))) return "Supplier not found";
  return null;
};

// GET /api/v1/products?page=1&limit=10&category=Apparel&supplier=Bulldog Threads&minPrice=100&maxPrice=900&search=jacket&sort=-price
const getProducts = async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value !== "string") {
        return sendError(res, HttpStatus.BAD_REQUEST, `Query parameter "${key}" can only be given once`);
      }
    }
    const { page = "1", limit = "10", category, supplier, minPrice, maxPrice, search, sort = "createdAt" } = req.query;

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return sendError(res, HttpStatus.BAD_REQUEST, "page must be a whole number of 1 or more");
    }
    if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      return sendError(res, HttpStatus.BAD_REQUEST, "limit must be a whole number from 1 to 100");
    }

    // Filtering and keyword search
    const filter = {};
    if (category) filter.category = (await findIdByName(Category, category)) ?? NO_MATCH;
    if (supplier) filter.supplier = (await findIdByName(Supplier, supplier)) ?? NO_MATCH;
    for (const [key, operator] of [["minPrice", "$gte"], ["maxPrice", "$lte"]]) {
      if (req.query[key] === undefined) continue;
      const price = Number(req.query[key]);
      if (req.query[key].trim() === "" || Number.isNaN(price) || price < 0) {
        return sendError(res, HttpStatus.BAD_REQUEST, `${key} must be a number of 0 or more`);
      }
      filter.price = { ...filter.price, [operator]: price };
    }
    if (search) filter.$text = { $search: search };

    // Sorting: "price" = lowest first, "-price" = highest first, several fields separated by commas
    const sortBy = {};
    for (const field of sort.split(",").map((f) => f.trim())) {
      const key = field.replace(/^-/, "");
      if (!SORTABLE_FIELDS.includes(key)) {
        return sendError(res, HttpStatus.BAD_REQUEST, `Cannot sort by "${key}". Use: ${SORTABLE_FIELDS.join(", ")}`);
      }
      sortBy[key] = field.startsWith("-") ? -1 : 1;
    }
    sortBy._id = 1; // keeps the order stable between pages

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortBy)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate(productPopulate),
      Product.countDocuments(filter),
    ]);

    return sendSuccess(res, HttpStatus.OK, "Products retrieved successfully.", products, {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.name }).populate(productPopulate);
    if (!product) return sendError(res, HttpStatus.NOT_FOUND, "Product not found");
    return sendSuccess(res, HttpStatus.OK, "Product retrieved successfully.", product);
  } catch (error) {
    return handleError(res, error);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.validate();

    const missing = await findMissingReference(product);
    if (missing) return sendError(res, HttpStatus.BAD_REQUEST, missing);

    await product.save();
    await product.populate(productPopulate);
    return sendSuccess(res, HttpStatus.CREATED, "Product created successfully.", product);
  } catch (error) {
    return handleError(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const missing = await findMissingReference(req.body);
    if (missing) return sendError(res, HttpStatus.BAD_REQUEST, missing);

    const product = await Product.findOneAndUpdate({ name: req.params.name }, req.body, {
      returnDocument: "after",
      runValidators: true,
    }).populate(productPopulate);
    if (!product) return sendError(res, HttpStatus.NOT_FOUND, "Product not found");
    return sendSuccess(res, HttpStatus.OK, "Product updated successfully.", product);
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ name: req.params.name });
    if (!product) return sendError(res, HttpStatus.NOT_FOUND, "Product not found");

    // Asset management: a deleted product should not leave its image behind in Cloudinary
    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId).catch((error) => console.error("Failed to delete Cloudinary asset:", error));
    }

    return sendSuccess(res, HttpStatus.OK, "Product deleted successfully.", product);
  } catch (error) {
    return handleError(res, error);
  }
};

// POST /api/v1/products/:name/upload-image - Admin only, multipart/form-data, field name "image"
const uploadProductImage = async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.name });
    if (!product) return sendError(res, HttpStatus.NOT_FOUND, "Product not found");
    if (!req.file) return sendError(res, HttpStatus.BAD_REQUEST, "No image file was uploaded");

    const previousPublicId = product.imagePublicId;

    // Multer's fileFilter only checks the Content-Type the client claims, which can be
    // spoofed; Cloudinary inspects the actual bytes and rejects the upload if they are not
    // really an image, so that needs its own 400 instead of falling through to a 500.
    let result;
    try {
      result = await uploadBufferToCloudinary(req.file.buffer, { folder: "bulldogs-exchange/products" });
    } catch (uploadError) {
      return sendError(res, HttpStatus.BAD_REQUEST, "The uploaded file is not a valid image");
    }
    product.image = result.secure_url;
    product.imagePublicId = result.public_id;
    await product.save();

    // Replacement, not accumulation: remove the image this one just replaced
    if (previousPublicId) {
      await cloudinary.uploader.destroy(previousPublicId).catch((error) => console.error("Failed to delete the replaced Cloudinary asset:", error));
    }

    await product.populate(productPopulate);
    return sendSuccess(res, HttpStatus.OK, "Product image uploaded successfully.", product);
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadProductImage };
