const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "partner"], default: "user" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  savedFoods: [{ type: String }], // Store food IDs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
