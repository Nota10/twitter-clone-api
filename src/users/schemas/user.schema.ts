import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Avatar, AvatarModel } from 'src/aws/schemas/avatar.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, default: false })
  protected: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: Date })
  birthday: Date;

  @Prop({ default: '' })
  bio: string;

  @Prop({ type: [String], required: true, default: [] })
  followers: string[];

  @Prop({ required: true, default: 0 })
  followersCount: number;

  @Prop({ type: [String], required: true, default: [] })
  following: string[];

  @Prop({ required: true, default: 0 })
  followingCount: number;

  @Prop({ required: true, default: 0 })
  statusesCount: number;

  @Prop({ required: true, default: 0 })
  favoritesCount: number;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ type: Avatar, default: new AvatarModel() })
  avatar: Avatar;
}

export const UserSchema = SchemaFactory.createForClass(User);
