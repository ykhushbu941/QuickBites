const jwt = require("jsonwebtoken");

// ✅ Protect Route
exports.protect = (req, res, next) => {
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
exports.isPartner = (req, res, next) => {
  if (req.user.role !== "partner") {
    return res.status(403).json({ msg: "Access denied: Partners only" });
  }

  next();
};