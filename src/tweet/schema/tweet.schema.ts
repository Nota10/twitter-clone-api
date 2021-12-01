import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserShort } from '../../users/schemas/userShort.schema';

@Schema({ timestamps: true })
export class Tweet extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: UserShort, required: true })
  user: UserShort;

  @Prop({ type: Types.ObjectId, required: false, default: null })
  parentTweetId: string;

  @Prop({ required: true, default: 0 })
  likeCount: number;

  @Prop({ type: [String], required: true, default: [] })
  likeList: string[];

  @Prop({ required: true, default: 0 })
  deslikeCount: number;

  @Prop({ type: [String], required: true, default: [] })
  deslikeList: string[];

  @Prop({ type: [String], required: true, default: [] })
  hashtags: string[];

  @Prop({ type: [String], required: true, default: [] })
  images: string[];
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
