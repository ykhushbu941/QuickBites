const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const bcrypt = require("bcryptjs");

// Store JSON file next to server.js
const adapter = new FileSync(path.join(__dirname, "db.json"));
const db = low(adapter);

// ─── Set Defaults ─────────────────────────────────────────────────
function initDb() {
  db.defaults({ users: [], foods: [], orders: [], reviews: [] }).write();

  // Auto-seed if no foods exist
  if (db.get("foods").size().value() === 0) {
    seedData();
  }

  console.log("✅ Local JSON database ready (db.json)");
}

// ─── ID Generator ─────────────────────────────────────────────────
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Seed Data ────────────────────────────────────────────────────
function seedData() {
  console.log("🌱 Seeding initial data...");

  const hashed = bcrypt.hashSync("12345", 10);
  const partnerId = newId();

  // Create partner if not exists
  if (!db.get("users").find({ email: "partner@reelbite.com" }).value()) {
    db.get("users").push({
      id: partnerId,
      _id: partnerId,
      name: "ReelBite Official Partner",
      email: "partner@reelbite.com",
      password: hashed,
      role: "partner",
      phone: "1234567890",
      address: "ReelBite HQ",
      savedFoods: [],
      createdAt: new Date().toISOString()
    }).write();
  }

  const partner = db.get("users").find({ email: "partner@reelbite.com" }).value();

  const foods = [
    { name: "Hyderabadi Dum Biryani", videoUrl: "/videos/reel1.mp4", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop", price: 380, restaurant: "Biryani House", category: "Biryani", cuisine: "North Indian", isVeg: false, description: "Authentic slow-cooked basmati rice with tender marinated meat and aromatic spices." },
    { name: "Paneer Tikka Platter", videoUrl: "/videos/reel2.mp4", imageUrl: "https://images.unsplash.com/photo-1567188040759-fbcd18884932?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop", price: 280, restaurant: "The Tandoor", category: "Starters", cuisine: "North Indian", isVeg: true, description: "Smoky, grilled paneer cubes marinated in a rich yogurt and spice mix." },
    { name: "Masala Dosa Classic", videoUrl: "/videos/reel3.mp4", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=200&auto=format&fit=crop", price: 140, restaurant: "Dakshin Vibes", category: "Breakfast", cuisine: "South Indian", isVeg: true, description: "Crispy gold fermented crepe filled with spiced potato mash served with chutney." },
    { name: "Street Style Chaat", videoUrl: "/videos/reel4.mp4", imageUrl: "https://images.unsplash.com/photo-1601050638917-3d973df11059?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1526234362653-3b75a0c07438?q=80&w=200&auto=format&fit=crop", price: 90, restaurant: "Chaat Corner", category: "Other", cuisine: "Indian", isVeg: true, description: "A burst of sweet, spicy, and tangy flavors in every bite." },
    { name: "Butter Chicken Mastery", videoUrl: "/videos/reel5.mp4", imageUrl: "https://images.unsplash.com/photo-1603894584115-f73f2ec04af0?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop", price: 450, restaurant: "Punjab Express", category: "Main Course", cuisine: "North Indian", isVeg: false, description: "Creamy, velvety tomato gravy with succulent roasted chicken pieces." },
    { name: "Truffle Mushroom Pizza", videoUrl: "/videos/reel6.mp4", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=200&auto=format&fit=crop", price: 549, restaurant: "Artisan Oven", category: "Pizza", cuisine: "Italian", isVeg: true, description: "Wood-fired pizza topped with wild mushrooms and premium truffle oil." },
    { name: "Chicken Alfredo Pasta", videoUrl: "/videos/reel7.mp4", imageUrl: "https://images.unsplash.com/photo-1645112481335-502a1ed756da?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=200&auto=format&fit=crop", price: 390, restaurant: "Pasta Bella", category: "Pasta", cuisine: "Italian", isVeg: false, description: "Fettuccine tossed in a rich, buttery parmesan cream sauce with grilled chicken." },
    { name: "Margherita Naples", videoUrl: "/videos/reel8.mp4", imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200&auto=format&fit=crop", price: 350, restaurant: "Pizzeria Uno", category: "Pizza", cuisine: "Italian", isVeg: true, description: "The classic with fresh mozzarella, basil, and San Marzano tomatoes." },
    { name: "Dragon Roll Sushi", videoUrl: "/videos/reel9.mp4", imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop", price: 650, restaurant: "Sakura Zen", category: "Sushi", cuisine: "Japanese", isVeg: false, description: "Tempura shrimp roll topped with avocado and sweet eel sauce." },
    { name: "Spicy Miso Ramen", videoUrl: "/videos/reel10.mp4", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1544650039-22886fbb4323?q=80&w=200&auto=format&fit=crop", price: 420, restaurant: "Ramen House", category: "Main Course", cuisine: "Japanese", isVeg: false, description: "Hearty broth with hand-pulled noodles, soft-boiled egg, and pork belly." },
    { name: "Veggie Gyoza", videoUrl: "/videos/reel1.mp4", imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop", price: 240, restaurant: "Tokyo Treats", category: "Starters", cuisine: "Japanese", isVeg: true, description: "Pan-fried dumplings filled with seasoned vegetables." },
    { name: "Street Style Tacos", videoUrl: "/videos/reel2.mp4", imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865597?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop", price: 290, restaurant: "Tacology", category: "Tacos", cuisine: "Mexican", isVeg: false, description: "Corn tortillas filled with grilled meat, cilantro, onions, and spicy salsa." }
  ];

  const now = new Date();
  const foodsWithIds = foods.map((f, i) => {
    const fid = newId();
    return {
      ...f,
      id: fid,
      _id: fid,
      createdBy: partner.id,
      likes: [],
      comments: [],
      createdAt: new Date(now.getTime() - i * 60000).toISOString()
    };
  });

  db.get("foods").push(...foodsWithIds).write();

  // Seed mock orders
  const orderNames = [
    { name: "Rahul Sharma", addr: "B-21, Park View Apts", status: "Pending" },
    { name: "Priya Singh", addr: "Sector 45, Green Colony", status: "Preparing" },
    { name: "Amit Verma", addr: "Indira Nagar, Near Mall", status: "Out for Delivery" },
    { name: "Sneha Kapur", addr: "Civic Center, Flat 302", status: "Delivered" }
  ];

  const mockOrders = orderNames.map((ord, idx) => {
    const f1 = foodsWithIds[idx % foodsWithIds.length];
    const oid = newId();
    return {
      id: oid,
      _id: oid,
      userId: partner.id,
      items: [
        { foodId: f1.id, quantity: 1, price: f1.price, name: f1.name }
      ],
      totalAmount: f1.price + 45,
      status: ord.status,
      deliveryAddress: ord.addr,
      paymentMethod: "cod",
      onlinePaymentDetails: {},
      createdAt: new Date(Date.now() - idx * 3600000).toISOString()
    };
  });

  db.get("orders").push(...mockOrders).write();

  console.log(`✅ Seeded ${foodsWithIds.length} foods + ${mockOrders.length} orders`);
  console.log("🔑 Partner login: partner@reelbite.com / 12345");
}

module.exports = { db, initDb, newId };
