const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(-[a-z0-9]+)*$/, "Product name must be a URL slug, e.g. campus-tote-bag"],
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: String,
      enum: {
        values: ["In stock", "Low stock", "Out of stock", "Preorder"],
        message: "{VALUE} is not a valid stock status",
      },
      default: "In stock",
    },
    content: [String],
    // image: a Cloudinary secure_url once uploaded (Activity 6), or still a local asset
    // filename (e.g. "totebag.png") for products seeded before that existed.
    image: String,
    // imagePublicId: the Cloudinary asset id, kept alongside image so a later replace or
    // delete can remove the old asset from Cloudinary instead of leaving it orphaned there.
    imagePublicId: String,
  },
  { timestamps: true }
);

productSchema.index({ category: 1, price: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Product", productSchema);
