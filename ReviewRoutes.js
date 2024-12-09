const express = require("express");
const { createReview, getReviews,deleteReview } = require("../controllers/reviewController");

const router = express.Router();

// POST /api/reviews - Create a new review
router.post("/", createReview);

// GET /api/reviews - Get all reviews
router.get("/", getReviews);

router.delete("/:id", deleteReview); // Delete a review by ID

module.exports = router;
