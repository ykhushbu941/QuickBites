const { db, newId } = require("../db");

function enrichOrder(order) {
  if (!order) return null;
  const items = (order.items || []).map(item => {
    const food = db.get("foods").find({ id: item.foodId }).value();
    return { ...item, food: food ? { ...food, _id: food.id } : null };
  });
  const user = db.get("users").find({ id: order.userId }).value();
  return {
    ...order,
    _id: order.id,
    user: user ? { _id: user.id, id: user.id, name: user.name, phone: user.phone, address: user.address, email: user.email } : { _id: order.userId },
    items
  };
}

// ✅ PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, paymentMethod, onlinePaymentDetails } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ msg: "No order items" });

    const order = {
      id: newId(),
      userId: req.user.id,
      items,
      totalAmount,
      status: "Pending",
      deliveryAddress,
      paymentMethod: paymentMethod || "cod",
      onlinePaymentDetails: onlinePaymentDetails || {},
      createdAt: new Date().toISOString()
    };

    db.get("orders").push(order).write();
    res.status(201).json(enrichOrder(order));
  } catch (err) {
    res.status(500).json({ msg: "Error placing order", error: err.message });
  }
};

// ✅ GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = db.get("orders")
      .filter({ userId: req.user.id })
      .value()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(orders.map(enrichOrder));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
};

// ✅ UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = db.get("orders").find({ id: req.params.id }).value();
    if (!order) return res.status(404).json({ msg: "Order not found" });

    db.get("orders").find({ id: req.params.id }).assign({ status }).write();
    const updated = db.get("orders").find({ id: req.params.id }).value();
    res.json(enrichOrder(updated));
  } catch (err) {
    res.status(500).json({ msg: "Error updating order status", error: err.message });
  }
};

// ✅ CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    const order = db.get("orders").find({ id: req.params.id, userId: req.user.id }).value();
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.status !== "Pending") return res.status(400).json({ msg: "Only Pending orders can be cancelled." });

    db.get("orders").find({ id: req.params.id }).assign({ status: "Cancelled" }).write();
    const updated = db.get("orders").find({ id: req.params.id }).value();
    res.json(enrichOrder(updated));
  } catch (err) {
    res.status(500).json({ msg: "Error cancelling order", error: err.message });
  }
};

// ✅ GET PARTNER ORDERS
exports.getPartnerOrders = async (req, res) => {
  try {
    const allOrders = db.get("orders").value()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const partnerOrders = allOrders.filter(order =>
      (order.items || []).some(item => {
        const food = db.get("foods").find({ id: item.foodId }).value();
        return food && food.createdBy === req.user.id;
      })
    );

    res.json(partnerOrders.map(enrichOrder));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching partner orders", error: err.message });
  }
};

// ✅ GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = db.get("orders").find({ id: req.params.id }).value();
    if (!order) return res.status(404).json({ msg: "Order not found" });
    if (order.userId !== req.user.id && req.user.role !== "partner") {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }
    res.json(enrichOrder(order));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching order details", error: err.message });
  }
};
