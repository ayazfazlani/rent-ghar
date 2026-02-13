
const mongoose = require('mongoose');
const uri = 'mongodb://fazlani362_db_user:Ts9r4zqAZab8dFf6@ac-zjxivxm-shard-00-00.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-01.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-02.y55tdfc.mongodb.net:27017/rent-ghar?ssl=true&replicaSet=atlas-ixd0oq-shard-0&authSource=admin&retryWrites=true&w=majority';

async function run() {
  try {
    await mongoose.connect(uri);
    const Property = mongoose.model('Property', new mongoose.Schema({}, { strict: false }));
    const Area = mongoose.model('Area', new mongoose.Schema({}, { strict: false }));
    const City = mongoose.model('City', new mongoose.Schema({}, { strict: false }));

    console.log('--- ALL APPROVED RENT PROPERTIES ---');
    const props = await Property.find({ status: 'approved', listingType: 'rent' }).lean();
    console.log(`Total: ${props.length}`);

    for (const p of props) {
      const area = p.area ? await Area.findById(p.area).lean() : null;
      const city = area ? await City.findById(area.city).lean() : null;

      const hasMultan = (p.location && /multan/i.test(p.location)) ||
        (p.title && /multan/i.test(p.title)) ||
        (area && area.name && /multan/i.test(area.name)) ||
        (city && city.name && /multan/i.test(city.name));

      if (hasMultan) {
        console.log(`[MATCH] Title: "${p.title}"`);
        console.log(`        Location: "${p.location}"`);
        console.log(`        PropertyType: "${p.propertyType}"`);
        console.log(`        Area: ${area ? area.name : 'null'} (${p.area})`);
        console.log(`        City: ${city ? city.name : 'null'}`);
        console.log('---');
      } else {
        // console.log(`[NOMATCH] Title: "${p.title}"`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
