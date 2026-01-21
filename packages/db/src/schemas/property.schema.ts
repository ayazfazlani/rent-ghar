import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Area } from './area.schema'
// import { City } from './city.schema'

@Schema({ timestamps: true })
export class Property extends Document {
  @Prop({ required: true, enum: ['rent', 'sale'] })
  listingType: 'rent' | 'sale'

  @Prop({ required: true, enum: ['house', 'apartment', 'flat', 'commercial'] })
  propertyType: 'house' | 'apartment' | 'flat' | 'commercial'

  // @Prop({ required: true })
  // city: string

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  location: string

  @Prop({ required: true })
  bedrooms: number

  @Prop({ required: true })
  bathrooms: number

  @Prop({ required: true })
  areaSize: number // sq ft - property size

  @Prop({ required: true })
  price: number // PKR

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  contactNumber: string

  @Prop({ type: [String], default: [] })
  features: string[]
  
  // Relations 
  @Prop({ type: Types.ObjectId, ref: 'Area', required: false, index: true })
  area?: Types.ObjectId | Area | null;

  // @Prop({ type: Types.ObjectId, ref: 'City', required: true, index: true, default: null })
  // city: Types.ObjectId | City | null;

  @Prop({ type: String }) // Cloudinary/S3 URL
  mainPhotoUrl?: string

  @Prop({ type: [String], default: [] })
  additionalPhotosUrls: string[]

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId

  @Prop({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected'
}

export const PropertySchema = SchemaFactory.createForClass(Property)