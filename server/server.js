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

// 🗄️ Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ CRITICAL: MONGODB_URI is not set in environment variables!");
  console.log("💡 Set MONGODB_URI in your Render dashboard or .env file");
} else {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("✅ MongoDB Connected!");
    // Run seeder after connection
    const { seedData } = require("./seeder");
    await seedData();
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
}

// 🔍 Health Check & Diagnostics
app.get("/", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStateLabel = ["disconnected", "connected", "connecting", "disconnecting"][dbState] || "unknown";
    
    let userCount = 0;
    let foodCount = 0;
    try {
      const User = require("./models/User");
      const Food = require("./models/Food");
      userCount = await User.countDocuments();
      foodCount = await Food.countDocuments();
    } catch(e) { /* ignore if models not ready */ }

    res.json({
      msg: "🚀 ReelBite API is Live!",
      status: "Operational",
      environment: process.env.NODE_ENV || "development",
      render: !!process.env.RENDER,
      diagnostics: {
        dbReady: dbState === 1,
        dbStatus: dbStateLabel,
        userCount,
        foodCount,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeVersion: process.version,
        uptime: Math.round(process.uptime()) + "s"
      },
      time: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ msg: "Diagnostic check failed", error: err.message });
  }
});

// 🛡️ Global Crash Protection
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
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