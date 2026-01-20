import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { City } from './city.schema';
import { Types, HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

export type AreaDocument = Area & Document;

@Schema({ timestamps: true })
export class Area {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true })
  city: Types.ObjectId | City;
}

export const AreaSchema = SchemaFactory.createForClass(Area);