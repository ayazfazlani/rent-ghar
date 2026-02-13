
const mongoose = require('mongoose');
const uri = 'mongodb://fazlani362_db_user:Ts9r4zqAZab8dFf6@ac-zjxivxm-shard-00-00.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-01.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-02.y55tdfc.mongodb.net:27017/rent-ghar?ssl=true&replicaSet=atlas-ixd0oq-shard-0&authSource=admin&retryWrites=true&w=majority';

const forbiddenNames = ['balcony', 'kitchen', 'furnished', 'laundry', 'parking', 'garage', 'swimming pool', 'garden', 'backyard', 'front yard'];

async function run() {
  try {
    await mongoose.connect(uri);

    const Area = mongoose.model('Area', new mongoose.Schema({ name: String, city: mongoose.Schema.Types.ObjectId }, { strict: false }));
    const Property = mongoose.model('Property', new mongoose.Schema({ title: String, area: mongoose.Schema.Types.ObjectId, features: [String] }, { strict: false }));

    console.log('Finding incorrect areas...');
    const badAreas = await Area.find({
      name: { $in: forbiddenNames }
    }).lean();

    console.log(`Found ${badAreas.length} incorrect area records.`);

    for (const area of badAreas) {
      console.log(`Processing area: ${area.name} (${area._id})...`);

      const props = await Property.find({ area: area._id });
      console.log(`Found ${props.length} properties referencing this area.`);

      for (const prop of props) {
        const currentFeatures = prop.features || [];
        if (!currentFeatures.includes(area.name)) {
          currentFeatures.push(area.name);
        }
        prop.features = currentFeatures;
        prop.area = null;
        await prop.save();
      }

      await Area.deleteOne({ _id: area._id });
      console.log(`Deleted area record: ${area.name}`);
    }

    // Also find areas with NO city link or linked to suspicious cities
    // Based on my debug, "multan" city id is 698b1ee4f302e0d68c7e5130
    // Let's check for areas not linked to Multan or other known cities if needed, 
    // but the forbidden name match is priority.

    console.log('Cleanup completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}
run();
