import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../../apps/monorepo-1/src/schemas/user.schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ strict: true, versionKey: false })
export class Token {
  @Prop()
  token: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
