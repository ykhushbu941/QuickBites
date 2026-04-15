const Food = require("../models/Food");
const User = require("../models/User");

// ✅ GET FOODS (Pagination + Filters)
exports.getFoods = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : null;
    const category = req.query.category && req.query.category !== "All" ? req.query.category : null;
    const cuisine = req.query.cuisine && req.query.cuisine !== "All" ? req.query.cuisine : null;
    const isVeg = req.query.isVeg;

    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { restaurant: { $regex: keyword, $options: "i" } }
      ];
    }
    if (category) query.category = category;
    if (cuisine) query.cuisine = cuisine;
    if (isVeg === "true") query.isVeg = true;
    if (isVeg === "false") query.isVeg = false;

    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json(foods.map(f => ({ ...f, _id: f._id.toString(), id: f._id.toString() })));
  } catch (err) {
    res.status(500).json({ msg: "Error fetching foods", error: err.message });
  }
};

// ✅ LIKE / UNLIKE (Toggle)
exports.likeFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: "Food not found" });

    const userId = req.user.id;
    const idx = food.likes.indexOf(userId);
    if (idx > -1) food.likes.splice(idx, 1);
    else food.likes.push(userId);

    await food.save();
    const updated = food.toObject();
    res.json({ ...updated, _id: updated._id.toString(), id: updated._id.toString() });
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

    const food = await Food.create({
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
      comments: []
    });

    const obj = food.toObject();
    res.status(201).json({ ...obj, _id: obj._id.toString(), id: obj._id.toString() });
  } catch (err) {
    res.status(500).json({ msg: "Error adding food", error: err.message });
  }
};

// ✅ DELETE FOOD (Only Owner)
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: "Food not found" });
    if (food.createdBy.toString() !== req.user.id) return res.status(403).json({ msg: "Not authorized" });

    await food.deleteOne();
    res.json({ msg: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting food", error: err.message });
  }
};

// ✅ ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: "Food not found" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text is required" });

    const user = await User.findById(req.user.id).lean();
    food.comments.push({
      user: { id: req.user.id, name: user ? user.name : "User" },
      text,
      createdAt: new Date()
    });

    await food.save();
    res.status(201).json(food.comments);
  } catch (err) {
    res.status(500).json({ msg: "Error adding comment", error: err.message });
  }
};