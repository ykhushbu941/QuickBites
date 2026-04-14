const mongoose = require('mongoose');
require('dotenv').config({path: './.env'});
const Food = require('./models/Food');

async function audit() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reelbite');
    const items = await Food.find({});
    console.log(`Auditing ${items.length} items...`);
    
    let missing = 0;
    items.forEach(i => {
      if (!i.imageUrl || i.imageUrl.trim().length < 5) {
        console.log(`❌ MISSING PHOTO: ${i.name} (ID: ${i._id})`);
        missing++;
      } else {
        // console.log(`✅ HAS PHOTO: ${i.name}`);
      }
    });
    
    console.log(`Summary: ${missing} items missing photos.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
audit();
