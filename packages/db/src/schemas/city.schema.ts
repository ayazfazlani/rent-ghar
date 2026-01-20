import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CityDocument = City & Document;

@Schema({ timestamps: true })
export class City {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  state: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  country: string;

}

export const CitySchema = SchemaFactory.createForClass(City);