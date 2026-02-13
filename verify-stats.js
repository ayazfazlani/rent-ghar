
const mongoose = require('mongoose');
const uri = 'mongodb://fazlani362_db_user:Ts9r4zqAZab8dFf6@ac-zjxivxm-shard-00-00.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-01.y55tdfc.mongodb.net:27017,ac-zjxivxm-shard-00-02.y55tdfc.mongodb.net:27017/rent-ghar?ssl=true&replicaSet=atlas-ixd0oq-shard-0&authSource=admin&retryWrites=true&w=majority';

async function run() {
  try {
    await mongoose.connect(uri);
    const Property = mongoose.model('Property', new mongoose.Schema({}, { strict: false }));

    const city = 'multan';
    const cityRegex = new RegExp(`${city}`, 'i');
    const matchStage = { status: 'approved', listingType: 'rent' };

    const stats = await Property.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          areaIdObj: {
            $cond: {
              if: { $eq: [{ $type: '$area' }, 'string'] },
              then: { $toObjectId: '$area' },
              else: '$area'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'areaIdObj',
          foreignField: '_id',
          as: 'areaDetails'
        }
      },
      { $unwind: { path: '$areaDetails', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          cityIdObj: {
            $cond: {
              if: { $eq: [{ $type: '$areaDetails.city' }, 'string'] },
              then: { $toObjectId: '$areaDetails.city' },
              else: '$areaDetails.city'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'cityIdObj',
          foreignField: '_id',
          as: 'cityDetails'
        }
      },
      { $unwind: { path: '$cityDetails', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          computedCityName: {
            $ifNull: ['$cityDetails.name', '$city']
          }
        }
      },
      {
        $match: {
          $or: [
            { computedCityName: cityRegex },
            { location: cityRegex },
            { title: cityRegex }
          ]
        }
      },
      {
        $facet: {
          locations: [
            {
              $match: { 'areaDetails.name': { $exists: true, $ne: null } }
            },
            {
              $group: {
                _id: { name: '$areaDetails.name', id: '$areaDetails._id' },
                count: { $sum: 1 }
              }
            },
            { $project: { name: '$_id.name', count: 1, _id: 0 } }
          ],
          total: [{ $count: 'count' }]
        }
      }
    ]).exec();

    console.log('Stats Result:', JSON.stringify(stats[0], null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
