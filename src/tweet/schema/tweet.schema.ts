import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserShort } from '../../users/schemas/userShort.schema';

@Schema({ timestamps: true })
export class Tweet extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: UserShort, required: true })
  user: UserShort;

  @Prop({ required: false, default: null })
  parentTweetId: string;

  @Prop({ required: true, default: 0 })
  like: number;

  @Prop({ required: true, default: 0 })
  deslike: number;

  @Prop({ type: [String], required: true, default: [] })
  hashtags: string[];

  @Prop({ type: [String], required: true, default: [] })
  images: string[];
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
