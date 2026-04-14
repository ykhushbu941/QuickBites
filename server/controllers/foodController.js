const { db, newId } = require("../db");

function parseFood(f) {
  if (!f) return null;
  return { ...f, _id: f.id };
}

// ✅ GET FOODS (Pagination + Filters)
exports.getFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : null;
    const category = req.query.category && req.query.category !== "All" ? req.query.category : null;
    const cuisine = req.query.cuisine && req.query.cuisine !== "All" ? req.query.cuisine : null;
    const isVeg = req.query.isVeg;

    let foods = db.get("foods").value();

    // Sort newest first
    foods = [...foods].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply filters
    if (keyword) {
      foods = foods.filter(f =>
        f.name.toLowerCase().includes(keyword) ||
        f.restaurant.toLowerCase().includes(keyword)
      );
    }
    if (category) foods = foods.filter(f => f.category === category);
    if (cuisine) foods = foods.filter(f => f.cuisine === cuisine);
    if (isVeg === "true") foods = foods.filter(f => f.isVeg === true);
    if (isVeg === "false") foods = foods.filter(f => f.isVeg === false);

    // Paginate
    const paginated = foods.slice((page - 1) * limit, page * limit);

    res.json(paginated.map(parseFood));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching foods", error: err.message });
  }
};

// ✅ LIKE / UNLIKE (Toggle)
exports.likeFood = async (req, res) => {
  try {
    const food = db.get("foods").find({ id: req.params.id }).value();
    if (!food) return res.status(404).json({ msg: "Food not found" });

    const userId = req.user.id;
    let likes = [...(food.likes || [])];
    const idx = likes.indexOf(userId);
    if (idx > -1) likes.splice(idx, 1);
    else likes.push(userId);

    db.get("foods").find({ id: req.params.id }).assign({ likes }).write();
    const updated = db.get("foods").find({ id: req.params.id }).value();
    res.json(parseFood(updated));
  } catch (err) {
    res.status(500).json({ msg: "Error liking food", error: err.message });
  }
};

// ✅ ADD FOOD (Partner Only)
exports.addFood = async (req, res) => {
  try {
    const { name, videoUrl, price, restaurant, description, category, imageUrl, restaurantImageUrl, isVeg, cuisine } = req.body;
    if (!name || !videoUrl || !price || !restaurant) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    const food = {
      id: newId(),
      name,
      videoUrl,
      imageUrl: imageUrl || "",
      restaurantImageUrl: restaurantImageUrl || "",
      price,
      restaurant,
      description: description || "",
      category: category || "Other",
      isVeg: !!isVeg,
      cuisine: cuisine || "Other",
      createdBy: req.user.id,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    db.get("foods").push(food).write();
    res.status(201).json(parseFood(food));
  } catch (err) {
    res.status(500).json({ msg: "Error adding food", error: err.message });
  }
};

// ✅ DELETE FOOD (Only Owner)
exports.deleteFood = async (req, res) => {
  try {
    const food = db.get("foods").find({ id: req.params.id }).value();
    if (!food) return res.status(404).json({ msg: "Food not found" });
    if (food.createdBy !== req.user.id) return res.status(403).json({ msg: "Not authorized" });

    db.get("foods").remove({ id: req.params.id }).write();
    res.json({ msg: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting food", error: err.message });
  }
};

// ✅ ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const food = db.get("foods").find({ id: req.params.id }).value();
    if (!food) return res.status(404).json({ msg: "Food not found" });
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text is required" });

    const user = db.get("users").find({ id: req.user.id }).value();
    const comments = [...(food.comments || [])];
    comments.push({
      user: { id: req.user.id, name: user ? user.name : "User" },
      text,
      createdAt: new Date().toISOString()
    });

    db.get("foods").find({ id: req.params.id }).assign({ comments }).write();
    res.status(201).json(comments);
  } catch (err) {
    res.status(500).json({ msg: "Error adding comment", error: err.message });
  }
};