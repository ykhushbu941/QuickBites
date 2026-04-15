const Order = require("../models/Order");
const Food = require("../models/Food");
const User = require("../models/User");

async function enrichOrder(order) {
  if (!order) return null;
  const obj = order.toObject ? order.toObject() : order;

  const items = await Promise.all((obj.items || []).map(async (item) => {
    const foodId = item.foodId || item.food;
    let food = null;
    if (foodId) {
      try {
        food = await Food.findById(foodId).lean();
      } catch (e) { /* ignore invalid id */ }
    }
    return { ...item, food: food ? { ...food, _id: food._id.toString(), id: food._id.toString() } : null };
  }));

  let user = null;
  try {
    user = await User.findById(obj.userId).lean();
  } catch (e) { /* ignore */ }

  return {
    ...obj,
    _id: obj._id?.toString(),
    id: obj._id?.toString(),
    items,
    user: user ? { ...user, _id: user._id.toString(), id: user._id.toString() } : null
  };
}

// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod, onlinePaymentDetails } = req.body;

    if (!items?.length || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ msg: "Missing required order fields" });
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || "cod",
      onlinePaymentDetails: onlinePaymentDetails || {},
      status: "Pending"
    });

    const enriched = await enrichOrder(order);
    res.status(201).json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error creating order", error: err.message });
  }
};

// ✅ GET USER'S OWN ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const enriched = await Promise.all(orders.map(enrichOrder));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
};

// ✅ GET ALL ORDERS (Partner Only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const enriched = await Promise.all(orders.map(enrichOrder));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all orders", error: err.message });
  }
};

// ✅ GET A SINGLE ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    if (order.userId.toString() !== req.user.id && req.user.role !== "partner") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const enriched = await enrichOrder(order);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching order", error: err.message });
  }
};

// ✅ UPDATE ORDER STATUS (Partner Only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: "Order not found" });

    const enriched = await enrichOrder(order);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error updating order status", error: err.message });
  }
};

// ✅ CANCEL ORDER (User can cancel their own Pending orders)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found" });

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({ msg: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    const enriched = await enrichOrder(order);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: "Error cancelling order", error: err.message });
  }
};
