require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { db, initDb } = require("./db");

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

// 🗄️ Initialise Local JSON Database (seeds data if empty)
initDb();

// 🔍 Enhanced Health Check & Diagnostics
app.get("/", (req, res) => {
  try {
    const dbInstance = require("./db").db;
    const dbState = dbInstance ? dbInstance.getState() : null;
    res.json({
      msg: "🚀 ReelBite API is Live!",
      status: "Operational",
      environment: process.env.NODE_ENV || "development",
      render: !!process.env.RENDER,
      diagnostics: {
        dbReady: !!dbInstance,
        dbSize: dbState ? Object.keys(dbState).length : 0,
        userCount: dbState?.users?.length || 0,
        foodCount: dbState?.foods?.length || 0,
        hasJwtSecret: !!process.env.JWT_SECRET,
        authRoutes: true,
        nodeVersion: process.version,
        uptime: Math.round(process.uptime()) + "s"
      },
      headers: {
        host: req.headers.host,
        userAgent: req.headers["user-agent"]
      },
      time: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ msg: "Diagnostic check failed", error: err.message });
  }
});

// Remove the old /api/debug endpoint as it's now part of root /
// app.get("/api/debug", ...);

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