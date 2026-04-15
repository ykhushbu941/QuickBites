const mongoose = require("mongoose");

// Guard middleware — returns 503 if MongoDB is not connected
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      msg: "⚠️ Database not connected. Please set MONGODB_URI in your Render environment variables and redeploy.",
      hint: "Go to Render Dashboard → Environment → Add MONGODB_URI"
    });
  }
  next();
};

// ✅ Protect Route
const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const secret = process.env.JWT_SECRET || "fallback_secret_for_emergency";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// ✅ Partner Only Access
const isPartner = (req, res, next) => {
  if (req.user.role !== "partner") {
    return res.status(403).json({ msg: "Access denied: Partners only" });
  }
  next();
};

module.exports = { protect, isPartner, requireDb };