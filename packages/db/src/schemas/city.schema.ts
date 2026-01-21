import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CityDocument = City & Document;

@Schema({ timestamps: true })
export class City {
  @Prop({ required: true, lowercase: true, trim: true })
  name: string;

  @Prop({ required: false, lowercase: true, trim: true })
  state?: string;

  @Prop({ required: false, lowercase: true, trim: true })
  country?: string;

  // Areas are optional - a city can exist without areas initially
  // Areas will reference the city, not the other way around
}

export const CitySchema = SchemaFactory.createForClass(City);

// Create unique index on name only - city names must be unique globally
CitySchema.index({ name: 1 }, { unique: true });