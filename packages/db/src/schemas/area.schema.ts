import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from './city.schema';
import { Types } from 'mongoose';
import { Document } from 'mongoose';

export type AreaDocument = Area & Document;

@Schema({ timestamps: true })
export class Area {
  @Prop({ required: true, lowercase: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true })
  city: Types.ObjectId | City;

  // Properties are optional - an area can exist without properties initially
  // Properties will reference the area, not the other way around
}

export const AreaSchema = SchemaFactory.createForClass(Area);

// Create compound index to ensure area names are unique per city
AreaSchema.index({ name: 1, city: 1 }, { unique: true });