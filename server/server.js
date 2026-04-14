require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");

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
  origin: true, // Reflect request origin
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

// 🔍 Health Check
app.get("/", (req, res) => {
  res.send("🚀 ReelBite API Running (Local JSON)...");
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