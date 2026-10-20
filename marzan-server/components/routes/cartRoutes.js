const express = require("express");
const { getCarts, getCart, createCart } = require("../controllers/cartController");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.get("/", authentication, getCarts);
router.get("/:id", authentication, getCart);
router.post("/", authentication, createCart);

module.exports = router;
