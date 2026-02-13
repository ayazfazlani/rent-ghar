
const mongoose = require('mongoose');
const uri = 'mongodb://fazlani362_db_user:Ts9r4zqAZab8dFf6@ac-zjxivxm-shard-00-00.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-01.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-02.y55tdfc.mongodb.net:27017/rent-ghar?ssl=true&replicaSet=atlas-ixd0oq-shard-0&authSource=admin&retryWrites=true&w=majority';

async function run() {
  try {
    await mongoose.connect(uri);
    const Area = mongoose.model('Area', new mongoose.Schema({}, { strict: false }));
    const City = mongoose.model('City', new mongoose.Schema({}, { strict: false }));

    const areaId = '698b1f23f302e0d68c7e5143';
    const area = await Area.findById(areaId).lean();
    console.log('Area:', area);

    if (area && area.city) {
      const city = await City.findById(area.city).lean();
      console.log('City:', city);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
