const express = require("express");
const { protect, isPartner, requireDb } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderById
} = require("../controllers/orderController");

const router = express.Router();

// All order routes require a DB connection
router.use(requireDb);

router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);          // User's own orders
router.get("/partner", protect, isPartner, getAllOrders); // Partner sees all orders
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, isPartner, updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
