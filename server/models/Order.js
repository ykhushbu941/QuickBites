const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    food: { type: String }, // Store food ID
    foodId: { type: String }, // Legacy support for both keys
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    name: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending" 
  },
  paymentMethod: { type: String, default: "cod" },
  onlinePaymentDetails: {
    upiId: String,
    cardLastFour: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
