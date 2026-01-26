import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from '../../../../packages/db/src/schemas/property.schema';
import { Area, AreaSchema } from '../../../../packages/db/src/schemas/area.schema';
import { City, CitySchema } from '../../../../packages/db/src/schemas/city.schema';
import { MongooseModule } from '@nestjs/mongoose';
// Temporarily commented out to debug DI issue
// import { StorageModule } from '../../../../packages/storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: Area.name, schema: AreaSchema },
      { name: City.name, schema: CitySchema }
    ])
    // StorageModule - temporarily removed
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService]
})
export class PropertyModule {}
