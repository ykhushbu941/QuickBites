const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Review = require("../models/Review");
const Food = require("../models/Food");

const router = express.Router();

// @route   POST /api/reviews
// @desc    Add a review
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;

    const review = new Review({
      user: req.user.id,
      food: foodId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ msg: "Error adding review", error: err.message });
  }
});

// @route   GET /api/reviews/food/:foodId
// @desc    Get reviews for a food item
// @access  Public
router.get("/food/:foodId", async (req, res) => {
  try {
    const reviews = await Review.find({ food: req.params.foodId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching reviews", error: err.message });
  }
});

module.exports = router;
