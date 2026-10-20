const express = require("express");
const { getReviews, getReview, createReview } = require("../controllers/reviewController");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReview);
router.post("/", authentication, createReview);

module.exports = router;
