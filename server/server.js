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
app.use(cors());
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

// Serve frontend in production
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "deploy") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
}

// 🌐 Database Connection + Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("✅ MongoDB Connected");

  // 🌱 Seed data (ONLY if DB empty)
  const count = await Food.countDocuments();

  if (count === 0) {
    await Food.insertMany([
      {
        name: "Cheese Burger",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        price: 199,
        restaurant: "Burger King",
        likes: []
      },
      {
        name: "Pizza",
        videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        price: 299,
        restaurant: "Dominos",
        likes: []
      },
      {
        name: "Pasta",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        price: 249,
        restaurant: "Italiano",
        likes: []
      }
    ]);

    console.log("🌱 Sample food data inserted");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

})
.catch((err) => {
  console.error("❌ DB Connection Error:", err.message);
});