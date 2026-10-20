const express = require("express");
const { getOrders, getOrder, createOrder, updateOrder } = require("../controllers/orderController");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.get("/", authentication, getOrders);
router.get("/:id", authentication, getOrder);
router.post("/", authentication, createOrder);
router.patch("/:id", authentication, updateOrder); // Admin, or the owner cancelling a Pending order (checked in the controller)

module.exports = router;
