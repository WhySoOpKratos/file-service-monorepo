import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

export type UserProfileDocument = HydratedDocument<UserProfile>;

export class Address {
  @Prop({ type: String, required: true })
  line1: string;
  @Prop({ type: String })
  line2?: string;
  @Prop({ type: String, required: true })
  areaCode: string;
  @Prop({ type: String, required: true })
  city: string;
  @Prop({ type: String, required: true })
  state: string;
  @Prop({ type: String, required: true })
  country: string;
}
@Schema({ strict: true, versionKey: false })
export class UserProfile {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: Date, required: true })
  dob: Date;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: String })
  phone: string;

  //ref prop
  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  userId: Types.ObjectId;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
