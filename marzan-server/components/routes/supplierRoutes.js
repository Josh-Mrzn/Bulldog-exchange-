const express = require("express");
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const router = express.Router();

router.get("/", getSuppliers);
router.get("/:id", getSupplier);
router.post("/", authentication, authorization("Admin"), createSupplier);
router.put("/:id", authentication, authorization("Admin"), updateSupplier);
router.delete("/:id", authentication, authorization("Admin"), deleteSupplier);

module.exports = router;
