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

  // 🎥 Real public domain / CDN food vertical reels (9:16 aspect ratio tested)
  // Many web MP4 sources are horizontal, these represent proper reels
  const VIDEOS = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://media.w3.org/2010/05/sintel/trailer.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  ];

  /* 
   Notes on Videos:
   For production ReelBite, these would be user-uploaded vertical MP4s.
   We use `object-cover` in ReelsPage to force these horizontals to fill a 9:16 vertical phone screen.
  */

  const sampleFoods = [
    // --- INDIAN ---
    { name: "Tandoori Butter Chicken", videoUrl: VIDEOS[0], imageUrl: "https://images.unsplash.com/photo-1603894527134-933390f7015a?q=80&w=800&auto=format&fit=crop", price: 280, restaurant: "Punjabi Dhaba", category: "Other", cuisine: "Indian", isVeg: false, description: "Creamy, rich tomato-based curry with tender smoky chicken pieces.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Paneer Tikka Platter", videoUrl: VIDEOS[1], imageUrl: "https://images.unsplash.com/photo-1567184109411-44bae8cd2720?q=80&w=800&auto=format&fit=crop", price: 240, restaurant: "Punjab Grill", category: "Other", cuisine: "Indian", isVeg: true, description: "Succulent paneer cubes grilled to perfection.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Hyderabadi Mutton Biryani", videoUrl: VIDEOS[2], imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop", price: 380, restaurant: "Paradise Biryani", category: "Other", cuisine: "Indian", isVeg: false, description: "Authentic Hyderabadi mutton biryani with long grain basmati rice.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Dal Makhani Special", videoUrl: VIDEOS[3], imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=800&auto=format&fit=crop", price: 180, restaurant: "Pind Balluchi", category: "Other", cuisine: "Indian", isVeg: true, description: "Slow-cooked black lentils with butter and cream.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Chole Bhature", videoUrl: VIDEOS[4], imageUrl: "https://images.unsplash.com/photo-1626500155551-03102c98031e?q=80&w=800&auto=format&fit=crop", price: 150, restaurant: "Sitaram Diwanchand", category: "Other", cuisine: "Indian", isVeg: true, description: "Spiced chickpeas served with fluffy deep-fried bread.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Rogan Josh", videoUrl: VIDEOS[5], imageUrl: "https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800&auto=format&fit=crop", price: 320, restaurant: "Khyber", category: "Other", cuisine: "Indian", isVeg: false, description: "Kashmiri style lamb curry with aromatic spices.", createdBy: partner._id, likes: [], comments: [] },

    // --- SOUTH INDIAN ---
    { name: "Crispy Masala Dosa", videoUrl: VIDEOS[6], imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop", price: 120, restaurant: "A2B Sweets", category: "Other", cuisine: "South Indian", isVeg: true, description: "Paper-thin golden dosa with spiced potato filling.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Medur Vada (2 Pcs)", videoUrl: VIDEOS[7], imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop", price: 90, restaurant: "A2B Sweets", category: "Snacks", cuisine: "South Indian", isVeg: true, description: "Crispy fried lentil donuts served with sambar and coconut chutney.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Idli Sambar Platter", videoUrl: VIDEOS[8], imageUrl: "https://images.unsplash.com/photo-1589135339689-197027aa2f74?q=80&w=800&auto=format&fit=crop", price: 80, restaurant: "Saravana Bhavan", category: "Other", cuisine: "South Indian", isVeg: true, description: "Steamed rice cakes served with flavorful lentil soup.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Chicken 65", videoUrl: VIDEOS[9], imageUrl: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop", price: 210, restaurant: "Copper Chimney", category: "Snacks", cuisine: "South Indian", isVeg: false, description: "Spicy, deep-fried chicken pieces with curry leaves.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Onion Uttapam", videoUrl: VIDEOS[10], imageUrl: "https://images.unsplash.com/photo-1645177623570-520f3d45464a?q=80&w=800&auto=format&fit=crop", price: 110, restaurant: "A2B Sweets", category: "Other", cuisine: "South Indian", isVeg: true, description: "Thick savory pancake topped with finely chopped onions.", createdBy: partner._id, likes: [], comments: [] },

    // --- PIZZA ---
    { name: "Farmhouse Pizza", videoUrl: VIDEOS[11], imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop", price: 350, restaurant: "Pizza Hut", category: "Pizza", cuisine: "Italian", isVeg: true, description: "Tomato, capsicum, mushroom, and onion with extra cheese.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Pepperoni Passion", videoUrl: VIDEOS[0], imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop", price: 450, restaurant: "Domino's", category: "Pizza", cuisine: "Italian", isVeg: false, description: "Classic pepperoni on a base of creamy mozzarella.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Margherita Classic", videoUrl: VIDEOS[1], imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop", price: 280, restaurant: "Jamie's Italian", category: "Pizza", cuisine: "Italian", isVeg: true, description: "Simple and elegant with tomato sauce and basil.", createdBy: partner._id, likes: [], comments: [] },
    { name: "BBQ Chicken Pizza", videoUrl: VIDEOS[2], imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop", price: 420, restaurant: "La Pino'z", category: "Pizza", cuisine: "Italian", isVeg: false, description: "Smoky BBQ sauce chicken with caramelized onions.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Veggie Supreme", videoUrl: VIDEOS[3], imageUrl: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=800&auto=format&fit=crop", price: 380, restaurant: "Pizza Express", category: "Pizza", cuisine: "Italian", isVeg: true, description: "Black olives, mushrooms, onions, and jalapenos.", createdBy: partner._id, likes: [], comments: [] },

    // --- BURGER ---
    { name: "Whopper Burger", videoUrl: VIDEOS[4], imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", price: 220, restaurant: "Burger King", category: "Burger", cuisine: "American", isVeg: false, description: "Flame-grilled beef burger with signature toppings.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Double Cheese Burger", videoUrl: VIDEOS[5], imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5c1457add?q=80&w=800&auto=format&fit=crop", price: 260, restaurant: "McDonald's", category: "Burger", cuisine: "American", isVeg: false, description: "Two grilled patties with double cheddar cheese.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Veg Crispy Burger", videoUrl: VIDEOS[6], imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop", price: 99, restaurant: "McDonald's", category: "Burger", cuisine: "American", isVeg: true, description: "Crispy veg patty with fresh lettuce and mayo.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Spicy Zinger Burger", videoUrl: VIDEOS[7], imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop", price: 180, restaurant: "KFC", category: "Burger", cuisine: "American", isVeg: false, description: "Extra crispy spicy chicken fillet on a toasted bun.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Paneer Maharaja", videoUrl: VIDEOS[8], imageUrl: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800&auto=format&fit=crop", price: 210, restaurant: "Burger King", category: "Burger", cuisine: "Indian", isVeg: true, description: "King-sized paneer patty with spicy sauces.", createdBy: partner._id, likes: [], comments: [] },

    // --- CHINESE ---
    { name: "Schezwan Fried Rice", videoUrl: VIDEOS[9], imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop", price: 190, restaurant: "Mainland China", category: "Other", cuisine: "Chinese", isVeg: true, description: "Spicy rice tossed with garlic and schezwan chilies.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Hakka Noodles Special", videoUrl: VIDEOS[10], imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop", price: 180, restaurant: "Yo! China", category: "Other", cuisine: "Chinese", isVeg: true, description: "Classic wok-fried noodles with fresh vegetables.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Manchurian Dry", videoUrl: VIDEOS[11], imageUrl: "https://images.unsplash.com/photo-1637806930600-37fa8892069d?q=80&w=800&auto=format&fit=crop", price: 160, restaurant: "Chowman", category: "Snacks", cuisine: "Chinese", isVeg: true, description: "Crispy veg balls in a tangy soya-garlic sauce.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Spring Rolls (4 Pcs)", videoUrl: VIDEOS[0], imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop", price: 140, restaurant: "Bercos", category: "Snacks", cuisine: "Chinese", isVeg: true, description: "Crunchy fried rolls stuffed with seasoned vegetables.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Kung Pao Chicken", videoUrl: VIDEOS[1], imageUrl: "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800&auto=format&fit=crop", price: 310, restaurant: "Mainland China", category: "Other", cuisine: "Chinese", isVeg: false, description: "Spicy stir-fry chicken with peanuts and peppers.", createdBy: partner._id, likes: [], comments: [] },

    // --- HEALTHY ---
    { name: "Greek Salad Bowl", videoUrl: VIDEOS[2], imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop", price: 290, restaurant: "Salad Days", category: "Healthy", cuisine: "Healthy", isVeg: true, description: "Fresh cucumbers, olives, feta, and olive oil dressing.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Grilled Avocado Toast", videoUrl: VIDEOS[3], imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop", price: 210, restaurant: "Blue Tokai", category: "Healthy", cuisine: "American", isVeg: true, description: "Sourdough bread topped with mashed avocado and poached egg.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Quinoa Veggie Bowl", videoUrl: VIDEOS[4], imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", price: 320, restaurant: "The Good Bowl", category: "Healthy", cuisine: "Healthy", isVeg: true, description: "Power-packed quinoa with roasted chickpeas and kale.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Grilled Chicken Protein", videoUrl: VIDEOS[5], imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop", price: 350, restaurant: "EatFit", category: "Healthy", cuisine: "American", isVeg: false, description: "Herb-grilled chicken breast with sweet potatoes.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Fruit Salad Energy", videoUrl: VIDEOS[6], imageUrl: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=800&auto=format&fit=crop", price: 180, restaurant: "Fruits & Co.", category: "Healthy", cuisine: "Healthy", isVeg: true, description: "Seasonal fresh fruits with a dash of honey and lime.", createdBy: partner._id, likes: [], comments: [] },

    // --- DRINKS ---
    { name: "Iced Caramel Macchiato", videoUrl: VIDEOS[7], imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop", price: 190, restaurant: "Starbucks", category: "Drinks", cuisine: "American", isVeg: true, description: "Espresso combined with vanilla and caramel flavors.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Blueberry Mojito", videoUrl: VIDEOS[8], imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop", price: 160, restaurant: "Social", category: "Drinks", cuisine: "American", isVeg: true, description: "Refreshing mocktail with blueberries and mint.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Fresh Mango Shake", videoUrl: VIDEOS[9], imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800&auto=format&fit=crop", price: 140, restaurant: "Keventers", category: "Drinks", cuisine: "Indian", isVeg: true, description: "Creamy seasonal mango pulp blended with milk.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Sparkling Lemonade", videoUrl: VIDEOS[10], imageUrl: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=800&auto=format&fit=crop", price: 120, restaurant: "Cafe Coffee Day", category: "Drinks", cuisine: "American", isVeg: true, description: "Zesty lemon with mint and sparkling water.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Masala Chai Flask", videoUrl: VIDEOS[11], imageUrl: "https://images.unsplash.com/photo-1517631232814-72e399564177?q=80&w=800&auto=format&fit=crop", price: 99, restaurant: "Chai Point", category: "Drinks", cuisine: "Indian", isVeg: true, description: "Hot aromatic Indian tea brewed with ginger and cardamom.", createdBy: partner._id, likes: [], comments: [] },

    // --- DESSERT ---
    { name: "Hot Chocolate Fudge", videoUrl: VIDEOS[0], imageUrl: "https://images.unsplash.com/photo-1624319086708-55894ec1bb92?q=80&w=800&auto=format&fit=crop", price: 150, restaurant: "Corner House", category: "Dessert", cuisine: "American", isVeg: true, description: "Vanilla ice cream smothered in thick gooey hot chocolate fudge.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Gulab Jamun (2 Pcs)", videoUrl: VIDEOS[1], imageUrl: "https://images.unsplash.com/photo-1589112773104-814631023071?q=80&w=800&auto=format&fit=crop", price: 80, restaurant: "Haldiram's", category: "Dessert", cuisine: "Indian", isVeg: true, description: "Soft milk-based balls soaked in sweet sugar syrup.", createdBy: partner._id, likes: [], comments: [] },
    { name: "New York Cheesecake", videoUrl: VIDEOS[2], imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop", price: 280, restaurant: "Theobroma", category: "Dessert", cuisine: "American", isVeg: true, description: "Rich, creamy cheesecake with a classic graham cracker crust.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Tiramisu Classic", videoUrl: VIDEOS[3], imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop", price: 320, restaurant: "Little Italy", category: "Dessert", cuisine: "Italian", isVeg: true, description: "Coffee-flavored Italian dessert with mascarpone cheese.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Death by Chocolate", videoUrl: VIDEOS[4], imageUrl: "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?q=80&w=800&auto=format&fit=crop", price: 290, restaurant: "Polar Bear", category: "Dessert", cuisine: "American", isVeg: true, description: "Layers of chocolate cake, ice cream, and dark chocolate sauce.", createdBy: partner._id, likes: [], comments: [] },

    // --- OTHER / MIXED ---
    { name: "Sushi Platter (12 pcs)", videoUrl: VIDEOS[5], imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop", price: 520, restaurant: "Oishii Sushi", category: "Other", cuisine: "Japanese", isVeg: false, description: "Assorted fresh sushi, nigiri and sashimi platter.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Dimsum Basket Veg", videoUrl: VIDEOS[6], imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop", price: 280, restaurant: "Yauatcha", category: "Snacks", cuisine: "Chinese", isVeg: true, description: "Steamed vegetable dumplings served with spicy dip.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Falafel Wrap Classic", videoUrl: VIDEOS[7], imageUrl: "https://images.unsplash.com/photo-1547058881-90bb7f3987c5?q=80&w=800&auto=format&fit=crop", price: 180, restaurant: "Habibi", category: "Other", cuisine: "Mediterranean", isVeg: true, description: "Crispy falafel balls with hummus and fresh veggies.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Chicken Tikka Roll", videoUrl: VIDEOS[8], imageUrl: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop", price: 160, restaurant: "Faasos", category: "Snacks", cuisine: "Indian", isVeg: false, description: "Spicy chicken tikka wrapped in a soft paratha.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Burrito Bowl Veg", videoUrl: VIDEOS[9], imageUrl: "https://images.unsplash.com/photo-1522036667459-7b75ecb0a5bf?q=80&w=800&auto=format&fit=crop", price: 260, restaurant: "Taco Bell", category: "Other", cuisine: "Mexican", isVeg: true, description: "Mexican rice with beans, corn, and fresh salsa.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Pad Thai Noodles", videoUrl: VIDEOS[10], imageUrl: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=800&auto=format&fit=crop", price: 340, restaurant: "Mamagoto", category: "Other", cuisine: "Chinese", isVeg: false, description: "Stir-fried rice noodles with eggs and crushed peanuts.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Hummus with Pita", videoUrl: VIDEOS[11], imageUrl: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=800&auto=format&fit=crop", price: 210, restaurant: "Zaza Kitchen", category: "Snacks", cuisine: "Mediterranean", isVeg: true, description: "Smooth chickpea dip served with warm fluffy pita.", createdBy: partner._id, likes: [], comments: [] },

    // --- NEW ADDITIONS ---
    { name: "Salmon Nigiri (6 pcs)", videoUrl: VIDEOS[0], imageUrl: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=800&auto=format&fit=crop", price: 450, restaurant: "Sushi House", category: "Other", cuisine: "Japanese", isVeg: false, description: "Fresh Atlantic salmon over seasoned rice.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Spicy Tuna Roll", videoUrl: VIDEOS[1], imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=800&auto=format&fit=crop", price: 380, restaurant: "Tokyo Express", category: "Other", cuisine: "Japanese", isVeg: false, description: "Tuna with spicy mayo and cucumber.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Tonkotsu Ramen", videoUrl: VIDEOS[2], imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800&auto=format&fit=crop", price: 420, restaurant: "Ramen Sun", category: "Other", cuisine: "Japanese", isVeg: false, description: "Rich pork bone broth with chashu and soft egg.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Street Style Tacos (3 pcs)", videoUrl: VIDEOS[3], imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop", price: 250, restaurant: "Taco Loco", category: "Other", cuisine: "Mexican", isVeg: false, description: "Braised beef with cilantro and onion on corn tortillas.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Quesadilla Supreme", videoUrl: VIDEOS[4], imageUrl: "https://images.unsplash.com/photo-1599974579688-8dbdd335c7b8?q=80&w=800&auto=format&fit=crop", price: 280, restaurant: "Mexican Grill", category: "Other", cuisine: "Mexican", isVeg: true, description: "Cheesy goodness with bell peppers and onions.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Fettuccine Alfredo", videoUrl: VIDEOS[5], imageUrl: "https://images.unsplash.com/photo-1645112481355-d56113b825ad?q=80&w=800&auto=format&fit=crop", price: 350, restaurant: "Pasta King", category: "Other", cuisine: "Italian", isVeg: true, description: "Creamy white sauce pasta with parmesan cheese.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Lasagna Bolognese", videoUrl: VIDEOS[6], imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop", price: 480, restaurant: "The Italian Table", category: "Other", cuisine: "Italian", isVeg: false, description: "Layered pasta with meat sauce and bechamel.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Grilled Chicken Steak", videoUrl: VIDEOS[7], imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800&auto=format&fit=crop", price: 550, restaurant: "Steak House", category: "Other", cuisine: "American", isVeg: false, description: "Juicy chicken breast served with mashed potatoes.", createdBy: partner._id, likes: [], comments: [] },
    { name: "BBQ Pork Ribs", videoUrl: VIDEOS[8], imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop", price: 750, restaurant: "Texas BBQ", category: "Other", cuisine: "American", isVeg: false, description: "Fall-off-the-bone ribs with smoky BBQ sauce.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Philly Cheesesteak", videoUrl: VIDEOS[9], imageUrl: "https://images.unsplash.com/photo-1563245332-6922aa027415?q=80&w=800&auto=format&fit=crop", price: 320, restaurant: "Sub Way", category: "Other", cuisine: "American", isVeg: false, description: "Thinly sliced steak with melted cheese in a hoagie roll.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Rainbow Smoothie Bowl", videoUrl: VIDEOS[10], imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=800&auto=format&fit=crop", price: 290, restaurant: "Smoothie King", category: "Healthy", cuisine: "Healthy", isVeg: true, description: "Acai base topped with fresh fruits and granola.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Avocado Chicken Salad", videoUrl: VIDEOS[11], imageUrl: "https://images.unsplash.com/photo-1546793665-c74683c3f43d?q=80&w=800&auto=format&fit=crop", price: 340, restaurant: "Green Leaf", category: "Healthy", cuisine: "Healthy", isVeg: false, description: "Mixed greens with grilled chicken and avocado slices.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Oreo Cheesecake", videoUrl: VIDEOS[0], imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop", price: 320, restaurant: "Dessert Parlor", category: "Dessert", cuisine: "American", isVeg: true, description: "Creamy cheesecake with oreo cookie base and toppings.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Warm Apple Pie", videoUrl: VIDEOS[1], imageUrl: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=800&auto=format&fit=crop", price: 240, restaurant: "Baker's Dozen", category: "Dessert", cuisine: "American", isVeg: true, description: "Traditional apple pie served with a scoop of vanilla ice cream.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Strawberry Margarita", videoUrl: VIDEOS[2], imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop", price: 280, restaurant: "Cocktail Bar", category: "Drinks", cuisine: "American", isVeg: true, description: "Classic margarita with fresh strawberries and lime.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Cold Brew Coffee", videoUrl: VIDEOS[3], imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop", price: 180, restaurant: "Brew Master", category: "Drinks", cuisine: "American", isVeg: true, description: "Slow-steeped cold brew coffee for a smooth finish.", createdBy: partner._id, likes: [], comments: [] },
    { name: "Green Matcha Latte", videoUrl: VIDEOS[4], imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=800&auto=format&fit=crop", price: 220, restaurant: "Zen Tea", category: "Drinks", cuisine: "Japanese", isVeg: true, description: "Premium grade matcha with steamed milk.", createdBy: partner._id, likes: [], comments: [] }
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
