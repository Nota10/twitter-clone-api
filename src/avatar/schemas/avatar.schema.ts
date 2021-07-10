import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema({ timestamps: true, _id: false })
export class Avatar extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, unique: true })
  url: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
export const AvatarModel = model<Avatar>('Avatar', AvatarSchema);
