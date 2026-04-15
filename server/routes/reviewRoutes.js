const express = require("express");
const mongoose = require("mongoose");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Simple inline Review schema (no separate file needed)
const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  foodId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

// POST /api/reviews — Add a review
router.post("/", protect, async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;

    const review = await Review.create({
      userId: req.user.id,
      foodId,
      rating,
      comment: comment || ""
    });

    const user = await User.findById(req.user.id).lean();
    const obj = review.toObject();
    res.status(201).json({
      ...obj,
      _id: obj._id.toString(),
      id: obj._id.toString(),
      user: { _id: req.user.id, name: user ? user.name : "User" }
    });
  } catch (err) {
    res.status(500).json({ msg: "Error adding review", error: err.message });
  }
});

// GET /api/reviews/food/:foodId — Get reviews for a food
router.get("/food/:foodId", async (req, res) => {
  try {
    const reviews = await Review.find({ foodId: req.params.foodId })
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(reviews.map(async (r) => {
      let user = null;
      try { user = await User.findById(r.userId).lean(); } catch (e) {}
      return {
        ...r,
        _id: r._id.toString(),
        id: r._id.toString(),
        user: user ? { _id: user._id.toString(), name: user.name } : null
      };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching reviews", error: err.message });
  }
});

module.exports = router;
