require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Middleware
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// 🔧 Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", /\.vercel\.app$/],
  credentials: true
}));
app.use(express.json());

// 📝 Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 🗄️ Connect to MongoDB (non-blocking startup)
let dbConnected = false;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("⚠️  WARNING: MONGODB_URI is not set. Database features will be unavailable.");
  console.log("💡 Add MONGODB_URI in your Render environment variables to enable persistent storage.");
} else {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      dbConnected = true;
      console.log("✅ MongoDB Connected!");
      const { seedData } = require("./seeder");
      await seedData();
    })
    .catch(err => {
      console.error("❌ MongoDB connection failed:", err.message);
    });
}

// 🔍 Health Check
app.get("/", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStateLabel = ["disconnected", "connected", "connecting", "disconnecting"][dbState] || "unknown";

  let userCount = 0;
  let foodCount = 0;
  if (dbState === 1) {
    try {
      const User = require("./models/User");
      const Food = require("./models/Food");
      userCount = await User.countDocuments();
      foodCount = await Food.countDocuments();
    } catch(e) {}
  }

  res.json({
    msg: "🚀 ReelBite API is Live!",
    status: dbState === 1 ? "Operational" : "⚠️ DB not connected",
    environment: process.env.NODE_ENV || "development",
    render: !!process.env.RENDER,
    diagnostics: {
      dbReady: dbState === 1,
      dbStatus: dbStateLabel,
      hasMongoUri: !!process.env.MONGODB_URI,
      userCount,
      foodCount,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeVersion: process.version,
      uptime: Math.round(process.uptime()) + "s"
    },
    time: new Date().toISOString()
  });
});

// 🛡️ Global Crash Protection
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
});

// 🔐 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// ❌ Error Handling Middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;