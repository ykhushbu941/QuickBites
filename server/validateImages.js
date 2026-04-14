const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config({path: './.env'});
const Food = require('./models/Food');

async function validate() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reelbite');
    const items = await Food.find({});
    console.log(`Validating ${items.length} items...`);
    
    let broken = 0;
    for (const item of items) {
      if (!item.imageUrl) {
        console.log(`❌ NO URL: ${item.name}`);
        broken++;
        continue;
      }
      
      try {
        const response = await axios.head(item.imageUrl, { timeout: 5000 });
        if (response.status >= 400) {
          console.log(`❌ BROKEN (Status ${response.status}): ${item.name} - ${item.imageUrl}`);
          broken++;
        } else {
          // console.log(`✅ OK: ${item.name}`);
        }
      } catch (err) {
        console.log(`❌ ERROR (${err.message}): ${item.name} - ${item.imageUrl}`);
        broken++;
      }
    }
    
    console.log(`Summary: ${broken} broken or missing images found.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
validate();
