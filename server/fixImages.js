const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});

const Food = require('./models/Food');

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reelbite');
    console.log("Checking for foods without images...");
    
    const foods = await Food.find({});
    let count = 0;

    const defaultImages = [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800",
      "https://images.unsplash.com/photo-1567188040759-fbcd18884932?q=80&w=800",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800",
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865597?q=80&w=800",
      "https://images.unsplash.com/photo-1624319086708-55894ec1bb92?q=80&w=800"
    ];

    const defaultLogos = [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=200",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200",
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=200",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=200"
    ];

    for (let food of foods) {
      let updated = false;
      if (!food.imageUrl || food.imageUrl.trim() === "") {
        food.imageUrl = defaultImages[Math.floor(Math.random() * defaultImages.length)];
        updated = true;
      }
      if (!food.restaurantImageUrl || food.restaurantImageUrl.trim() === "") {
        food.restaurantImageUrl = defaultLogos[Math.floor(Math.random() * defaultLogos.length)];
        updated = true;
      }
      
      if (updated) {
        await food.save();
        console.log(`✅ Fixed photo for: ${food.name}`);
        count++;
      }
    }

    console.log(`Finished. Fixed ${count} items.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
