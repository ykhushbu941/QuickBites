const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  videoUrl: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  restaurantImageUrl: { type: String, default: "" },
  price: { type: Number, required: true },
  restaurant: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "Other" },
  cuisine: { type: String, default: "Other" },
  isVeg: { type: Boolean, default: false },
  createdBy: { type: String }, // Store User ID
  likes: [{ type: String }], // Store User IDs
  comments: [{
    user: { id: String, name: String },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Food", FoodSchema);
