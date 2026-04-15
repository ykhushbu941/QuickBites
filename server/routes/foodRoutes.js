const router = require("express").Router();
const { protect, isPartner, requireDb } = require("../middleware/authMiddleware");

const {
  getFoods,
  likeFood,
  addFood,
  deleteFood,
  addComment
} = require("../controllers/foodController");

router.use(requireDb);

router.get("/", getFoods);
router.post("/like/:id", protect, likeFood);
router.post("/comment/:id", protect, addComment);
router.post("/", protect, isPartner, addFood);
router.delete("/:id", protect, isPartner, deleteFood);

module.exports = router;