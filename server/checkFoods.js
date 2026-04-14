const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/reelbite');
        const Food = mongoose.model('Food', new mongoose.Schema({
            name: String,
            imageUrl: String,
            restaurantImageUrl: String
        }));

        const foods = await Food.find({});
        console.log(`Checking ${foods.length} foods...`);
        
        const missingFoodImg = foods.filter(f => !f.imageUrl);
        const missingRestImg = foods.filter(f => !f.restaurantImageUrl);

        if (missingFoodImg.length === 0 && missingRestImg.length === 0) {
            console.log("✅ ALL items have photos and restaurant logos.");
        } else {
            console.log(`❌ Missing Food Photos: ${missingFoodImg.length}`);
            console.log(`❌ Missing Rest Photos: ${missingRestImg.length}`);
            missingFoodImg.forEach(f => console.log(` - ${f.name} (ID: ${f._id})`));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
