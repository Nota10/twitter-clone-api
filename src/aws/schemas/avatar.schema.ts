import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema({ timestamps: true, _id: false })
export class Avatar extends Document {
  @Prop({ required: true, default: 'unknown.jpg' })
  key: string;

  @Prop({
    required: true,
    default:
      'https://twitterclone-pds-bucket.s3.sa-east-1.amazonaws.com/unknown.jpg',
  })
  url: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
export const AvatarModel = model<Avatar>('Avatar', AvatarSchema);
