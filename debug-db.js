
const mongoose = require('mongoose');
const uri = 'mongodb://fazlani362_db_user:Ts9r4zqAZab8dFf6@ac-zjxivxm-shard-00-00.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-01.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-02.y55tdfc.mongodb.net:27017/rent-ghar?ssl=true&replicaSet=atlas-ixd0oq-shard-0&authSource=admin&retryWrites=true&w=majority';


async function run() {
  try {
    await mongoose.connect(uri);
    const PropertySchema = new mongoose.Schema({
      title: String,
      city: mongoose.Schema.Types.Mixed,
      area: mongoose.Schema.Types.Mixed,
      location: String,
      status: String
    }, { strict: false });
    const Property = mongoose.model('Property', PropertySchema);

    const Area = mongoose.model('Area', new mongoose.Schema({ name: String, city: mongoose.Schema.Types.ObjectId }, { strict: false }));
    const City = mongoose.model('City', new mongoose.Schema({ name: String }, { strict: false }));

    const count = await Property.countDocuments();
    console.log('Total properties:', count);

    const multanCity = await City.findOne({ name: /multan/i });
    console.log('Multan City record:', multanCity);

    if (multanCity) {
      const areasInMultan = await Area.find({ city: multanCity._id }).lean();
      console.log(`Found ${areasInMultan.length} areas in Multan.`);
      console.log('Areas in Multan:', JSON.stringify(areasInMultan.map(a => ({ name: a.name, id: a._id })), null, 2));

      const areaIds = areasInMultan.map(a => a._id);
      const propsWithArea = await Property.find({ area: { $in: areaIds }, status: 'approved' }).limit(5).lean();
      console.log('Sample properties linked to Multan areas:', JSON.stringify(propsWithArea.map(p => ({ title: p.title, areaId: p.area })), null, 2));
    }

    // Check for "balcony" as an area
    const balconyArea = await Area.findOne({ name: /balcony/i });
    console.log('Balcony Area record:', balconyArea);
    if (balconyArea) {
      const count = await Property.countDocuments({ area: balconyArea._id });
      console.log('Properties linked to "balcony" area:', count);
    }

    process.exit(0);


  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
