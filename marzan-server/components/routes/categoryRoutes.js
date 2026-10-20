const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", authentication, authorization("Admin"), createCategory);
router.put("/:id", authentication, authorization("Admin"), updateCategory);
router.delete("/:id", authentication, authorization("Admin"), deleteCategory);

module.exports = router;
