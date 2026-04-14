require("dotenv").config();
const mongoose = require("mongoose");
const Food = require("./models/Food");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/reelbite")
.then(async () => {
  console.log("Connected to MongoDB for Seeding...");
  
  // 1. Create a dummy partner user to own the foods
  // Always hash and update so login works correctly
  const partnerEmail = "partner@reelbite.com";
  const partnerPass = "12345";
  const hashed = await bcrypt.hash(partnerPass, 10);

  let partner = await User.findOne({ email: partnerEmail });
  if (!partner) {
    partner = await User.create({
      name: "ReelBite Official Partner",
      email: partnerEmail,
      password: hashed,
      role: "partner",
      phone: "1234567890",
      address: "ReelBite HQ"
    });
  } else {
    // Force update password to ensure bcrypt works on login
    partner.password = hashed;
    await partner.save();
  }

  // Clear existing foods to start fresh with vertical reels
  await Food.deleteMany({});

  // 🎥 Pure Instagram Reels (provided by you)
  // We use CSS cropping in the frontend to show "just the video"

  const sampleFoods = [
    // --- 🇮🇳 INDIAN ---
    { 
      name: "Hyderabadi Dum Biryani", 
      videoUrl: "/videos/reel3.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop",
      price: 380, 
      restaurant: "Biryani House", 
      category: "Biryani", 
      cuisine: "North Indian", 
      isVeg: false, 
      description: "Authentic slow-cooked basmati rice with tender marinated meat and aromatic spices.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Paneer Tikka Platter", 
      videoUrl: "/videos/reel6.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1567188040759-fbcd18884932?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop",
      price: 280, 
      restaurant: "The Tandoor", 
      category: "Starters", 
      cuisine: "North Indian", 
      isVeg: true, 
      description: "Smoky, grilled paneer cubes marinated in a rich yogurt and spice mix.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Masala Dosa Classic", 
      videoUrl: "/videos/reel9.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=200&auto=format&fit=crop",
      price: 140, 
      restaurant: "Dakshin Vibes", 
      category: "Breakfast", 
      cuisine: "South Indian", 
      isVeg: true, 
      description: "Crispy gold fermented crepe filled with spiced potato mash served with chutney.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Street Style Chaat", 
      videoUrl: "/videos/reel3.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1601050638917-3d973df11059?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1526234362653-3b75a0c07438?q=80&w=200&auto=format&fit=crop",
      price: 90, 
      restaurant: "Chaat Corner", 
      category: "Other", 
      cuisine: "Indian", 
      isVeg: true, 
      description: "A burst of sweet, spicy, and tangy flavors in every bite.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Butter Chicken Mastery", 
      videoUrl: "/videos/reel1.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1603894584115-f73f2ec04af0?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop",
      price: 450, 
      restaurant: "Punjab Express", 
      category: "Main Course", 
      cuisine: "North Indian", 
      isVeg: false, 
      description: "Creamy, velvety tomato gravy with succulent roasted chicken pieces.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🇮🇹 ITALIAN ---
    { 
      name: "Truffle Mushroom Pizza", 
      videoUrl: "/videos/reel1.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=200&auto=format&fit=crop",
      price: 549, 
      restaurant: "Artisan Oven", 
      category: "Pizza", 
      cuisine: "Italian", 
      isVeg: true, 
      description: "Wood-fired pizza topped with wild mushrooms and premium truffle oil.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Chicken Alfredo Pasta", 
      videoUrl: "/videos/reel7.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1645112481335-502a1ed756da?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=200&auto=format&fit=crop",
      price: 390, 
      restaurant: "Pasta Bella", 
      category: "Pasta", 
      cuisine: "Italian", 
      isVeg: false, 
      description: "Fettuccine tossed in a rich, buttery parmesan cream sauce with grilled chicken.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Margherita Naples", 
      videoUrl: "/videos/reel1.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=200&auto=format&fit=crop",
      price: 350, 
      restaurant: "Pizzeria Uno", 
      category: "Pizza", 
      cuisine: "Italian", 
      isVeg: true, 
      description: "The classic with fresh mozzarella, basil, and San Marzano tomatoes.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🇯🇵 JAPANESE ---
    { 
      name: "Dragon Roll Sushi", 
      videoUrl: "/videos/reel7.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop",
      price: 650, 
      restaurant: "Sakura Zen", 
      category: "Sushi", 
      cuisine: "Japanese", 
      isVeg: false, 
      description: "Tempura shrimp roll topped with avocado and sweet eel sauce.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Spicy Miso Ramen", 
      videoUrl: "/videos/reel5.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1544650039-22886fbb4323?q=80&w=200&auto=format&fit=crop",
      price: 420, 
      restaurant: "Ramen House", 
      category: "Main Course", 
      cuisine: "Japanese", 
      isVeg: false, 
      description: "Hearty broth with hand-pulled noodles, soft-boiled egg, and pork belly.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Veggie Gyoza", 
      videoUrl: "/videos/reel7.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop",
      price: 240, 
      restaurant: "Tokyo Treats", 
      category: "Starters", 
      cuisine: "Japanese", 
      isVeg: true, 
      description: "Pan-fried dumplings filled with seasoned vegetables.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🇲🇽 MEXICAN ---
    { 
      name: "Street Style Tacos", 
      videoUrl: "/videos/reel2.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865597?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop",
      price: 290, 
      restaurant: "Tacology", 
      category: "Tacos", 
      cuisine: "Mexican", 
      isVeg: false, 
      description: "Corn tortillas filled with grilled meat, cilantro, onions, and spicy salsa.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Loaded Veggie Nachos", 
      videoUrl: "/videos/reel2.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?q=80&w=200&auto=format&fit=crop",
      price: 320, 
      restaurant: "Mexi-Grill", 
      category: "Snacks", 
      cuisine: "Mexican", 
      isVeg: true, 
      description: "Crispy chips loaded with cheese, jalapeños, beans, and fresh guacamole.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Chicken Quesadilla", 
      videoUrl: "/videos/reel2.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=200&auto=format&fit=crop",
      price: 360, 
      restaurant: "Zocalo", 
      category: "Other", 
      cuisine: "Mexican", 
      isVeg: false, 
      description: "Toasted tortilla oozing with cheese and seasoned chicken.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🇺🇸 AMERICAN ---
    { 
      name: "Double Smash Burger", 
      videoUrl: "/videos/reel2.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop",
      price: 350, 
      restaurant: "Burger Junction", 
      category: "Burger", 
      cuisine: "American", 
      isVeg: false, 
      description: "Two juicy patties smashed with cheese and caramelized onions.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "BBQ Chicken Wings", 
      videoUrl: "/videos/reel6.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=200&auto=format&fit=crop",
      price: 310, 
      restaurant: "Wings Mania", 
      category: "Snacks", 
      cuisine: "American", 
      isVeg: false, 
      description: "Tossed in smoky hickory BBQ sauce with a ranch dip.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Caramel Milkshake", 
      videoUrl: "/videos/reel8.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1563191799-2c7e8c185bb3?q=80&w=200&auto=format&fit=crop",
      price: 180, 
      restaurant: "Liquid Gold", 
      category: "Drinks", 
      cuisine: "American", 
      isVeg: true, 
      description: "Creamy vanilla base blended with rich sea-salt caramel.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🇨🇳 CHINESE / THAI ---
    { 
      name: "Veg Hakka Noodles", 
      videoUrl: "/videos/reel7.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=200&auto=format&fit=crop",
      price: 210, 
      restaurant: "The Wok", 
      category: "Other", 
      cuisine: "Chinese", 
      isVeg: true, 
      description: "Classic stir-fried noodles with crisp vegetables and soya sauce.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Pad Thai Shrimps", 
      videoUrl: "/videos/reel7.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=200&auto=format&fit=crop",
      price: 480, 
      restaurant: "Sawadee", 
      category: "Main Course", 
      cuisine: "Thai", 
      isVeg: false, 
      description: "Sweet and tangy rice noodles with peanuts and fresh shrimps.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Dim Sum Basket", 
      videoUrl: "/videos/reel7.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=200&auto=format&fit=crop",
      price: 320, 
      restaurant: "Steam Hub", 
      category: "Starters", 
      cuisine: "Chinese", 
      isVeg: true, 
      description: "Assorted vegetarian dumplings steamed to perfection.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🥗 HEALTHY / MEDITERRANEAN ---
    { 
      name: "Quinoa Avocado Bowl", 
      videoUrl: "/videos/reel5.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=200&auto=format&fit=crop",
      price: 360, 
      restaurant: "Green Glow", 
      category: "Healthy", 
      cuisine: "Healthy", 
      isVeg: true, 
      description: "Superfood bowl with fresh greens, feta, and lemon dressing.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Hummus & Falafel", 
      videoUrl: "/videos/reel5.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?q=80&w=200&auto=format&fit=crop",
      price: 280, 
      restaurant: "Olive Tree", 
      category: "Healthy", 
      cuisine: "Mediterranean", 
      isVeg: true, 
      description: "Creamy hummus served with crispy chickpea falafels and pita.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Grilled Greek Chicken", 
      videoUrl: "/videos/reel5.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1632778149975-40045263a941?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1632778149975-40045263a941?q=80&w=200&auto=format&fit=crop",
      price: 440, 
      restaurant: "Mediterranean Grill", 
      category: "Healthy", 
      cuisine: "Mediterranean", 
      isVeg: false, 
      description: "Herb-marinated chicken breast served with roasted veggies.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🍰 DESSERTS ---
    { 
      name: "Warm Choco Lava Cake", 
      videoUrl: "/videos/reel4.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1624319086708-55894ec1bb92?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1624319086708-55894ec1bb92?q=80&w=200&auto=format&fit=crop",
      price: 220, 
      restaurant: "Treat Corner", 
      category: "Dessert", 
      cuisine: "American", 
      isVeg: true, 
      description: "Gooey chocolate center served with a scoop of vanilla bean ice cream.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Classic New York Cheesecake", 
      videoUrl: "/videos/reel4.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=200&auto=format&fit=crop",
      price: 290, 
      restaurant: "Sweet Escape", 
      category: "Dessert", 
      cuisine: "American", 
      isVeg: true, 
      description: "Velvety smooth cheesecake on a graham cracker crust.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Tiramisu Elegance", 
      videoUrl: "/videos/reel10.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=200&auto=format&fit=crop",
      price: 320, 
      restaurant: "Italiano Dolce", 
      category: "Dessert", 
      cuisine: "Italian", 
      isVeg: true, 
      description: "Layers of coffee-soaked ladyfingers and mascarpone cream.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- 🌯 ROLLS / WRAPS ---
    { 
      name: "Paneer Kathi Roll", 
      videoUrl: "/videos/reel9.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1626776876729-babd0f0a53b4?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200&auto=format&fit=crop",
      price: 180, 
      restaurant: "Roll Junction", 
      category: "Rolls", 
      cuisine: "Indian", 
      isVeg: true, 
      description: "Spiced paneer and onions wrapped in a soft paratha.", 
      createdBy: partner._id, likes: [], comments: [] 
    },
    { 
      name: "Chicken Shawarma Wrap", 
      videoUrl: "/videos/reel6.mp4", 
      imageUrl: "https://images.unsplash.com/photo-1561651823-34fed022530b?q=80&w=800&auto=format&fit=crop", 
      restaurantImageUrl: "https://images.unsplash.com/photo-1561651823-34fed022530b?q=80&w=200&auto=format&fit=crop",
      price: 220, 
      restaurant: "Middle East Bites", 
      category: "Rolls", 
      cuisine: "Mediterranean", 
      isVeg: false, 
      description: "Slow-roasted chicken with garlic sauce and pickles.", 
      createdBy: partner._id, likes: [], comments: [] 
    },

    // --- Extra Variety to hit 40 ---
    { name: "Pesto Pasta Fusion", videoUrl: "/videos/reel7.mp4", imageUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=200&auto=format&fit=crop", price: 380, restaurant: "Pasta Bella", category: "Pasta", cuisine: "Italian", isVeg: true, description: "Fresh basil pesto with pine nuts and sun-dried tomatoes.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Margarita Cocktail", videoUrl: "/videos/reel8.mp4", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200&auto=format&fit=crop", price: 150, restaurant: "Liquid Gold", category: "Drinks", cuisine: "Mexican", isVeg: true, description: "Zesty and refreshing lime cocktail with a salt rim.", createdBy: partner._id, likes: [], comments: [] },
    { name: "BBQ Paneer Pizza", videoUrl: "/videos/reel1.mp4", imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=200&auto=format&fit=crop", price: 499, restaurant: "Pizza Hut", category: "Pizza", cuisine: "Italian", isVeg: true, description: "Tangy BBQ sauce with grilled paneer and onions.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Fish & Chips", videoUrl: "/videos/reel6.mp4", imageUrl: "https://images.unsplash.com/photo-1524339102455-66097b447883?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1524339102455-66097b447883?q=80&w=200&auto=format&fit=crop", price: 420, restaurant: "The Dock", category: "Main Course", cuisine: "Continental", isVeg: false, description: "Crispy battered fish served with chunky fries and tartar sauce.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Veg Manchurian", videoUrl: "/videos/reel7.mp4", imageUrl: "https://images.unsplash.com/photo-1512058560374-140ddf61726a?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1512058560374-140ddf61726a?q=80&w=200&auto=format&fit=crop", price: 190, restaurant: "Wok Express", category: "Starters", cuisine: "Chinese", isVeg: true, description: "Veggie balls in a spicy, umami-rich soy and ginger gravy.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Falafel Salad", videoUrl: "/videos/reel5.mp4", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop", price: 280, restaurant: "Green Glow", category: "Healthy", cuisine: "Healthy", isVeg: true, description: "Crunchy salad bowls with hot falafels and tahini.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Salmon Sushi Nigiri", videoUrl: "/videos/reel7.mp4", imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=200&auto=format&fit=crop", price: 580, restaurant: "Sushi Zen", category: "Sushi", cuisine: "Japanese", isVeg: false, description: "Fresh slices of premium salmon over hand-pressed vinegared rice.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Beef Steak Fries", videoUrl: "/videos/reel6.mp4", imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13ea0?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13ea0?q=80&w=200&auto=format&fit=crop", price: 450, restaurant: "Steak House", category: "Main Course", cuisine: "American", isVeg: false, description: "Perfectly seared beef steak served with peppercorn sauce.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Thai Green Curry", videoUrl: "/videos/reel5.mp4", imageUrl: "https://images.unsplash.com/photo-1455619411447-960250dfc252?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1455619411447-960250dfc252?q=80&w=200&auto=format&fit=crop", price: 390, restaurant: "Lotus Pad", category: "Main Course", cuisine: "Thai", isVeg: true, description: "Coconut-based curry with bamboo shoots and aromatic basil.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Blueberry Cheesecake", videoUrl: "/videos/reel4.mp4", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=200&auto=format&fit=crop", price: 290, restaurant: "Sweet Escape", category: "Dessert", cuisine: "American", isVeg: true, description: "Creamy cheesecake topped with fresh blueberry compote.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Butter Garlic Naan", videoUrl: "/videos/reel9.mp4", imageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=800&auto=format&fit=crop", restaurantImageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=200&auto=format&fit=crop", price: 60, restaurant: "The Tandoor", category: "Bread", cuisine: "North Indian", isVeg: true, description: "Soft, leavened bread with a generous glaze of garlic butter.", createdBy: partner._id, likes: [], comments: [] }
  ];


  const insertedFoods = await Food.insertMany(sampleFoods);
  console.log(`Successfully seeded ${sampleFoods.length} beautiful food entries into DB!`);

  // 2. Create mock orders for the partner dashboard
  const Order = require("./models/Order");
  await Order.deleteMany({});
  
  const orderList = [
    { name: "Rahul Sharma", addr: "B-21, Park View Apts", status: "Pending" },
    { name: "Priya Singh", addr: "Sector 45, Green Colony", status: "Preparing" },
    { name: "Amit Verma", addr: "Indira Nagar, Near Mall", status: "Out for Delivery" },
    { name: "Sneha Kapur", addr: "Civic Center, Flat 302", status: "Delivered" },
    { name: "Karan Malhotra", addr: "Golf Link Road, House 12", status: "Pending" },
    { name: "Deepika R.", addr: "IT Park Main Gate", status: "Preparing" },
    { name: "Suresh Mani", addr: "Lake View Residency", status: "Delivered" },
    { name: "John Doe", addr: "123 Business Way", status: "Cancelled" }
  ];

  const mockOrders = orderList.map((ord, idx) => {
    const f1 = insertedFoods[idx % insertedFoods.length];
    const f2 = insertedFoods[(idx + 3) % insertedFoods.length];
    
    return {
      user: partner._id,
      items: [
        { food: f1._id, quantity: 1, price: f1.price },
        { food: f2._id, quantity: 2, price: f2.price }
      ],
      totalAmount: f1.price + (f2.price * 2) + 45,
      status: ord.status,
      deliveryAddress: ord.addr,
      createdAt: new Date(Date.now() - (idx * 3600000)) 
    };
  });

  await Order.insertMany(mockOrders);
  console.log(`Successfully seeded ${mockOrders.length} various mock orders for the partner dashboard!`);
  console.log(`Test Partner login: partner@reelbite.com / 12345`);
  process.exit(0);
})
.catch(err => {
  console.error("DB Seed Error:", err);
  process.exit(1);
});
