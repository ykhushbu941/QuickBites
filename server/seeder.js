const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Food = require("../models/Food");

const PARTNER_FOODS = [
  { name: "Hyderabadi Dum Biryani", videoUrl: "/videos/reel1.mp4", imageUrl: "https://images.unsplash.com/photo-1589302168068-1c481193521b?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1589302168068-1c481193521b?q=80&w=800&auto=format&fit=crop", price: 380, restaurant: "Biryani House", category: "Biryani", cuisine: "North Indian", isVeg: false, description: "Authentic slow-cooked basmati rice with tender marinated meat." },
  { name: "Paneer Tikka Platter", videoUrl: "/videos/reel2.mp4", imageUrl: "https://images.unsplash.com/photo-1567184109311-5dc9504c5520?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1567184109311-5dc9504c5520?q=80&w=800&auto=format&fit=crop", price: 280, restaurant: "The Tandoor", category: "Starters", cuisine: "North Indian", isVeg: true, description: "Smoky, grilled paneer cubes marinated in a rich yogurt and spice mix." },
  { name: "Masala Dosa Classic", videoUrl: "/videos/reel3.mp4", imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979bdb?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979bdb?q=80&w=800&auto=format&fit=crop", price: 140, restaurant: "Dakshin Vibes", category: "Breakfast", cuisine: "South Indian", isVeg: true, description: "Crispy fermented crepe filled with spiced potato mash." },
  { name: "Street Style Chaat", videoUrl: "/videos/reel4.mp4", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop", price: 90, restaurant: "Chaat Corner", category: "Other", cuisine: "Indian", isVeg: true, description: "Sweet, spicy, and tangy in every bite." },
  { name: "Butter Chicken Mastery", videoUrl: "/videos/reel5.mp4", imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop", price: 450, restaurant: "Punjab Express", category: "Main Course", cuisine: "North Indian", isVeg: false, description: "Creamy tomato gravy with roasted chicken pieces." },
  { name: "Truffle Mushroom Pizza", videoUrl: "/videos/reel6.mp4", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop", price: 549, restaurant: "Artisan Oven", category: "Pizza", cuisine: "Italian", isVeg: true, description: "Wood-fired pizza topped with wild mushrooms and truffle oil." },
  { name: "Chicken Alfredo Pasta", videoUrl: "/videos/reel7.mp4", imageUrl: "https://images.unsplash.com/photo-1645112481338-31620a8fe368?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1645112481338-31620a8fe368?q=80&w=800&auto=format&fit=crop", price: 390, restaurant: "Pasta Bella", category: "Pasta", cuisine: "Italian", isVeg: false, description: "Fettuccine in buttery parmesan cream sauce with grilled chicken." },
  { name: "Margherita Naples", videoUrl: "/videos/reel8.mp4", imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=800&auto=format&fit=crop", price: 350, restaurant: "Pizzeria Uno", category: "Pizza", cuisine: "Italian", isVeg: true, description: "Fresh mozzarella, basil, and San Marzano tomatoes." },
  { name: "Dragon Roll Sushi", videoUrl: "/videos/reel9.mp4", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop", price: 650, restaurant: "Sakura Zen", category: "Sushi", cuisine: "Japanese", isVeg: false, description: "Tempura shrimp roll topped with avocado and eel sauce." },
  { name: "Spicy Miso Ramen", videoUrl: "/videos/reel10.mp4", imageUrl: "https://images.unsplash.com/photo-1557872246-7a79b099910f?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1557872246-7a79b099910f?q=80&w=800&auto=format&fit=crop", price: 420, restaurant: "Ramen House", category: "Main Course", cuisine: "Japanese", isVeg: false, description: "Hearty broth with hand-pulled noodles and pork belly." },
  { name: "Veggie Gyoza", videoUrl: "/videos/reel1.mp4", imageUrl: "https://images.unsplash.com/photo-1591814441559-075e7a5ac135?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1591814441559-075e7a5ac135?q=80&w=800&auto=format&fit=crop", price: 240, restaurant: "Tokyo Treats", category: "Starters", cuisine: "Japanese", isVeg: true, description: "Pan-fried dumplings filled with seasoned vegetables." },
  { name: "Street Style Tacos", videoUrl: "/videos/reel2.mp4", imageUrl: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?q=80&w=800&auto=format&fit=crop", price: 290, restaurant: "Tacology", category: "Tacos", cuisine: "Mexican", isVeg: false, description: "Grilled meat, cilantro, onions, and spicy salsa." }
];

async function seedData() {
  try {
    // Seed partner account if not exists
    let partner = await User.findOne({ email: "partner@reelbite.com" });
    if (!partner) {
      const hashed = await bcrypt.hash("12345", 10);
      partner = await User.create({
        name: "ReelBite Official Partner",
        email: "partner@reelbite.com",
        password: hashed,
        role: "partner",
        phone: "1234567890",
        address: "ReelBite HQ"
      });
      console.log("✅ Partner account seeded: partner@reelbite.com / 12345");
    }

    // Seed foods if none exist
    const foodCount = await Food.countDocuments();
    if (foodCount < 12) {
      await Food.deleteMany({});
      const foods = PARTNER_FOODS.map(f => ({
        ...f,
        createdBy: partner._id.toString(),
        likes: [],
        comments: []
      }));
      await Food.insertMany(foods);
      console.log(`✅ Seeded ${foods.length} food items`);
    }
  } catch (err) {
    console.error("❌ Seeder error:", err.message);
  }
}

module.exports = { seedData };
