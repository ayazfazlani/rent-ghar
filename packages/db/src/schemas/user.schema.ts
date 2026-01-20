import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User { 
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ enum: ['USER', 'AGENT', 'ADMIN'], default: 'USER' })
  role: string;

  @Prop({ select: false })
  refreshToken?: string; // hashed version - for secure refresh

  // Optional fields
  @Prop()
  name?: string;

  @Prop()
  phone?: string;

  // Add profile picture, agencyId, etc. later
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
  ;
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};