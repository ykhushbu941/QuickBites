const User = require("../models/User");
const Food = require("../models/Food");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    console.log(`📝 Register attempt: ${email}`);

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
      phone: phone || "",
      address: address || "",
      savedFoods: []
    });

    console.log(`✅ Registered: ${email}`);
    const { password: _, ...safeUser } = user.toObject();
    res.json({ msg: "Registered", user: { ...safeUser, id: user._id.toString(), _id: user._id.toString() } });
  } catch (err) {
    console.error(`❌ Registration Error: ${err.stack}`);
    res.status(500).json({ msg: "Error registering", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔑 Login attempt: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ Login failed: User ${email} not found`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    console.log(`✅ Login successful for: ${email} (role: ${user.role})`);

    const secret = process.env.JWT_SECRET || "fallback_secret_for_emergency";
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      secret,
      { expiresIn: "30d" }
    );

    const { password: _, ...safeUser } = user.toObject();
    res.json({
      token,
      role: user.role,
      user: { ...safeUser, id: user._id.toString(), _id: user._id.toString() }
    });
  } catch (err) {
    console.error(`❌ Login Error: ${err.stack}`);
    res.status(500).json({ msg: "Error logging in", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Populate savedFoods
    const savedFoods = await Food.find({ _id: { $in: user.savedFoods || [] } }).lean();

    const { password, ...safeUser } = user;
    res.json({ ...safeUser, id: user._id.toString(), _id: user._id.toString(), savedFoods });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user profile", error: err.message });
  }
};

exports.toggleSaveFood = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const foodId = req.params.id;
    const idx = user.savedFoods.indexOf(foodId);

    if (idx > -1) {
      user.savedFoods.splice(idx, 1);
    } else {
      user.savedFoods.push(foodId);
    }

    await user.save();
    res.json({ savedFoods: user.savedFoods });
  } catch (err) {
    res.status(500).json({ msg: "Error toggling saved food", error: err.message });
  }
};

exports.checkRole = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email }).lean();
    if (!user) return res.json({ role: null });
    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Error checking role" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await User.findByIdAndUpdate(req.user.id, { name, phone, address });
    res.json({ msg: "Profile updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  }
};