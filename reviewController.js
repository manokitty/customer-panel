const Review = require("../models/Review");

// Create a new review
const createReview = async (req, res) => {
  const { name, comment, stars } = req.body;

  try {
    const review = new Review({ name, comment, stars });
    await review.save();
    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    res.status(400).json({ message: "Failed to create review", error: error.message });
  }
};

// Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};


// Delete a review by ID
const deleteReview = async (req, res) => {
    const { id } = req.params;
  
    try {
      const review = await Review.findById(id);
  
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      await review.deleteOne();
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review", error: error.message });
    }
  };



module.exports = { createReview, getReviews,deleteReview };
