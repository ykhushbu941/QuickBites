const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { db, newId } = require("../db");

const router = express.Router();

// POST /api/reviews — Add a review
router.post("/", protect, async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;

    const review = {
      id: newId(),
      userId: req.user.id,
      foodId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    db.get("reviews").push(review).write();

    const user = db.get("users").find({ id: req.user.id }).value();
    res.status(201).json({
      ...review,
      _id: review.id,
      user: { _id: req.user.id, name: user ? user.name : "User" }
    });
  } catch (err) {
    res.status(500).json({ msg: "Error adding review", error: err.message });
  }
});

// GET /api/reviews/food/:foodId — Get reviews for a food
router.get("/food/:foodId", async (req, res) => {
  try {
    const reviews = db.get("reviews")
      .filter({ foodId: req.params.foodId })
      .value()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const enriched = reviews.map(r => {
      const user = db.get("users").find({ id: r.userId }).value();
      return { ...r, _id: r.id, user: user ? { _id: user.id, name: user.name } : null };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching reviews", error: err.message });
  }
});

module.exports = router;
