import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';

export type FilesDocument = HydratedDocument<Files>;

@Schema({ strict: true, versionKey: false })
export class Files {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  path: string;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  uploaded_date: string;

  @Prop({ type: String, required: true })
  mimetype: string;
}

export const FileSchema = SchemaFactory.createForClass(Files);
