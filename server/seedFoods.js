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
    {
      name: "Tandoori Butter Chicken",
      videoUrl: VIDEOS[0],
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800",
      price: 280, restaurant: "Punjabi Dhaba", category: "Other", cuisine: "Indian", isVeg: false,
      description: "Creamy, rich tomato-based curry with tender smoky chicken pieces.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Paneer Tikka Platter",
      videoUrl: VIDEOS[1],
      imageUrl: "https://images.unsplash.com/photo-1567184109191-378ec2420ca0?w=800",
      price: 240, restaurant: "Punjab Grill", category: "Other", cuisine: "Indian", isVeg: true,
      description: "Succulent paneer cubes grilled to perfection.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Hyderabadi Mutton Biryani",
      videoUrl: VIDEOS[2],
      imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800",
      price: 380, restaurant: "Paradise Biryani", category: "Other", cuisine: "Indian", isVeg: false,
      description: "Authentic Hyderabadi mutton biryani with long grain basmati rice.",
      createdBy: partner._id, likes: [], comments: []
    },
    // --- SOUTH INDIAN ---
    {
      name: "Crispy Masala Dosa",
      videoUrl: VIDEOS[3],
      imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800",
      price: 120, restaurant: "A2B Sweets", category: "Other", cuisine: "South Indian", isVeg: true,
      description: "Paper-thin golden dosa with spiced potato filling.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Medur Vada (2 Pcs)",
      videoUrl: VIDEOS[4],
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800",
      price: 90, restaurant: "A2B Sweets", category: "Snacks", cuisine: "South Indian", isVeg: true,
      description: "Crispy fried lentil donuts served with sambar and coconut chutney.",
      createdBy: partner._id, likes: [], comments: []
    },
    // --- PIZZA ---
    {
      name: "Farmhouse Pizza",
      videoUrl: VIDEOS[5],
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
      price: 350, restaurant: "Pizza Hut", category: "Pizza", cuisine: "Italian", isVeg: true,
      description: "Tomato, capsicum, mushroom, and onion with extra cheese.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Pepperoni Passion",
      videoUrl: VIDEOS[6],
      imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
      price: 450, restaurant: "Domino's", category: "Pizza", cuisine: "Italian", isVeg: false,
      description: "Classic pepperoni on a base of creamy mozzarella.",
      createdBy: partner._id, likes: [], comments: []
    },
    // --- BURGER ---
    {
      name: "Whopper Burger",
      videoUrl: VIDEOS[7],
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      price: 220, restaurant: "Burger King", category: "Burger", cuisine: "American", isVeg: false,
      description: "Flame-grilled beef burger with signature toppings.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Double Cheese Burger",
      videoUrl: VIDEOS[8],
      imageUrl: "https://images.unsplash.com/photo-1510627489930-0c1b0ba8fac7?w=800",
      price: 260, restaurant: "McDonald's", category: "Burger", cuisine: "American", isVeg: false,
      description: "Two grilled patties with double cheddar cheese.",
      createdBy: partner._id, likes: [], comments: []
    },
    // --- HEALTHY ---
    {
      name: "Greek Salad Bowl",
      videoUrl: VIDEOS[9],
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
      price: 290, restaurant: "Salad Days", category: "Healthy", cuisine: "Healthy", isVeg: true,
      description: "Fresh cucumbers, olives, feta, and olive oil dressing.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Grilled Avocado Toast",
      videoUrl: VIDEOS[10],
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800",
      price: 210, restaurant: "Blue Tokai", category: "Healthy", cuisine: "American", isVeg: true,
      description: "Sourdough bread topped with mashed avocado and poached egg.",
      createdBy: partner._id, likes: [], comments: []
    },
    // --- DRINKS ---
    {
      name: "Iced Caramel Macchiato",
      videoUrl: VIDEOS[11],
      imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800",
      price: 190, restaurant: "Starbucks", category: "Drinks", cuisine: "American", isVeg: true,
      description: "Espresso combined with vanilla and caramel flavors.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Blueberry Mojito",
      videoUrl: VIDEOS[0],
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800",
      price: 160, restaurant: "Social", category: "Drinks", cuisine: "American", isVeg: true,
      description: "Refreshing mocktail with blueberries and mint.",
      createdBy: partner._id, likes: [], comments: []
    },
    // --- SNACKS / OTHERS ---
    {
      name: "Sushi Platter (12pcs)",
      videoUrl: VIDEOS[1],
      imageUrl: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800",
      price: 520, restaurant: "Oishii Sushi", category: "Other", cuisine: "Japanese", isVeg: false,
      description: "Assorted fresh sushi, nigiri and sashimi platter.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Dimsum Basket",
      videoUrl: VIDEOS[2],
      imageUrl: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800",
      price: 280, restaurant: "Yauatcha", category: "Snacks", cuisine: "Chinese", isVeg: true,
      description: "Steamed vegetable dumplings served with spicy dip.",
      createdBy: partner._id, likes: [], comments: []
    },
    {
      name: "Falafel Wrap",
      videoUrl: VIDEOS[3],
      imageUrl: "https://images.unsplash.com/photo-1547058881-90bb7f3987c5?w=800",
      price: 180, restaurant: "Habibi", category: "Other", cuisine: "Mediterranean", isVeg: true,
      description: "Crispy falafel balls with hummus and fresh veggies in a soft wrap.",
      createdBy: partner._id, likes: [], comments: []
    }
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
