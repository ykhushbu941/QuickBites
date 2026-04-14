require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Models
const Food = require("./models/Food");

// Middleware
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// 🔧 Middlewares
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// 🔍 Health Check Route (Production practice)
app.get("/", (req, res) => {
  res.send("🚀 ReelBite API Running...");
});

// 🔐 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

const path = require("path");

// ❌ Error Handling Middleware (must be last)
app.use(errorHandler);

// Note: Static frontend serving is handled by Vercel in production.
// This allows the backend to focus purely on the API.

// 🌐 Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ DB Connection Error:", err.message));

// Only skip listen() if we are on Vercel (serverless mode)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel Serverless Function
module.exports = app;