import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: false })
  protected: boolean;

  @Prop({ required: true })
  password: string;

  @Prop()
  bio: string;

  @Prop()
  birthday: Date;

  @Prop({ required: true, default: [] })
  followers: string[];

  @Prop({ required: true, default: 0 })
  followersCount: number;

  @Prop({ required: true, default: [] })
  following: string[];

  @Prop({ required: true, default: 0 })
  followingCount: number;

  @Prop({ required: true, default: 0 })
  statusesCount: number;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  @Prop({required: true, default: "unknown.png"})
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);