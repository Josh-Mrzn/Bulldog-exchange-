const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require("../controllers/productController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const upload = require("../middleware/uploadImageMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:name", getProduct);
router.post("/", authentication, authorization("Admin"), createProduct);
router.put("/:name", authentication, authorization("Admin"), updateProduct);
router.delete("/:name", authentication, authorization("Admin"), deleteProduct);
router.post("/:name/upload-image", authentication, authorization("Admin"), upload.single("image"), uploadProductImage);

module.exports = router;
