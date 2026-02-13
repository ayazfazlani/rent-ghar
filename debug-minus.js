
const mongoose = require('mongoose');
const uri = 'mongodb://fazlani362_db_user:Ts9r4zqAZab8dFf6@ac-zjxivxm-shard-00-00.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-01.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-02.y55tdfc.mongodb.net:27017/rent-ghar?ssl=true&replicaSet=atlas-ixd0oq-shard-0&authSource=admin&retryWrites=true&w=majority';

async function run() {
  try {
    await mongoose.connect(uri);
    const Property = mongoose.model('Property', new mongoose.Schema({}, { strict: false }));

    console.log('--- SEARCHING FOR "Minus" PROPERTIES ---');
    const props = await Property.find({ title: /Minus/i }).lean();
    console.log(`Found: ${props.length}`);

    for (const p of props) {
      console.log(`Title: "${p.title}"`);
      console.log(`Location: "${p.location}"`);
      console.log(`ListingType: "${p.listingType}"`);
      console.log(`Status: "${p.status}"`);
      console.log(`PropertyType: "${p.propertyType}"`);
      console.log(`Area: "${p.area}"`);
      console.log('---');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
