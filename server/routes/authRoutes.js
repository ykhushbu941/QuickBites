const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { register, login, getMe, toggleSaveFood, checkRole } = require("../controllers/authController");

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/check-role", checkRole);
router.get("/user/me", protect, getMe);
router.post("/user/save/:id", protect, toggleSaveFood);

module.exports = router;