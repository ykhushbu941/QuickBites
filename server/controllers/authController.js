const { db, newId } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const existing = db.get("users").find({ email }).value();
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const userId = newId();

    // 🕒 Tiny delay to stabilize persistent connection/file handle
    await new Promise(resolve => setTimeout(resolve, 150));
    const user = {
      id: userId,
      _id: userId, // Physically save _id in the DB
      name,
      email,
      password: hashed,
      role: role || "user",
      phone: phone || "",
      address: address || "",
      savedFoods: [],
      createdAt: new Date().toISOString()
    };

    console.log(`✅ Saving user to DB: ${email}`);
    db.get("users").push(user).write();
    res.json({ msg: "Registered", user });
  } catch (err) {
    console.error(`❌ Registration Error: ${err.stack}`);
    res.status(500).json({ 
      msg: "Error registering", 
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔑 Login attempt: ${email}`);
    
    // 🕒 Tiny delay to prevent resource contention
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const user = db.get("users").find({ email }).value();
    if (!user) {
      console.log(`❌ Login failed: User ${email} not found`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    let isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch && password === user.password) isMatch = true;
    if (!isMatch) {
      console.log(`❌ Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    
    console.log(`✅ Login successful for: ${email}`);

    const secret = process.env.JWT_SECRET || "fallback_secret_for_emergency";
    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: "30d" }
    );

    res.json({ 
      token, 
      role: user.role, 
      user: { ...user, _id: user.id, id: user.id } 
    });
  } catch (err) {
    console.error(`❌ Login Error: ${err.stack}`);
    res.status(500).json({ 
      msg: "Error logging in", 
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = db.get("users").find({ id: req.user.id }).value();
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Populate savedFoods
    const savedFoods = (user.savedFoods || []).map(fid => {
      const f = db.get("foods").find({ id: fid }).value();
      return f ? { ...f, _id: f.id } : null;
    }).filter(Boolean);

    const { password, ...safeUser } = user;
    res.json({ ...safeUser, _id: user.id, savedFoods });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user profile", error: err.message });
  }
};

exports.toggleSaveFood = async (req, res) => {
  try {
    const user = db.get("users").find({ id: req.user.id }).value();
    if (!user) return res.status(404).json({ msg: "User not found" });

    const foodId = req.params.id;
    let savedFoods = [...(user.savedFoods || [])];
    const idx = savedFoods.indexOf(foodId);

    if (idx > -1) {
      savedFoods.splice(idx, 1);
    } else {
      savedFoods.push(foodId);
    }

    db.get("users").find({ id: req.user.id }).assign({ savedFoods }).write();
    res.json({ savedFoods });
  } catch (err) {
    res.status(500).json({ msg: "Error toggling saved food", error: err.message });
  }
};

exports.checkRole = async (req, res) => {
  try {
    const { email } = req.query;
    const user = db.get("users").find({ email }).value();
    if (!user) return res.json({ role: null });
    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Error checking role" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    db.get("users").find({ id: req.user.id }).assign({ name, phone, address }).write();
    res.json({ msg: "Profile updated" });
  } catch (err) {
    res.status(500).json({ msg: "Error updating profile", error: err.message });
  }
};