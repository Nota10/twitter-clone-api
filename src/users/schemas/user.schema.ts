import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Avatar } from 'src/avatar/schemas/avatar.schema';
import { UserShort, UserShortSchema } from './userShort.schema';

export type UserDocument = User & Document;

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

  @Prop({ type: [UserShortSchema], required: true, default: [] })
  followers: UserShort[];

  @Prop({ required: true, default: 0 })
  followersCount: number;

  @Prop({ type: [UserShortSchema], required: true, default: [] })
  following: UserShort[];

  @Prop({ required: true, default: 0 })
  followingCount: number;

  @Prop({ required: true, default: 0 })
  statusesCount: number;

  @Prop({ required: true, default: 0 })
  favoritesCount: number;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ type: Avatar })
  avatar: Avatar;
}

export const UserSchema = SchemaFactory.createForClass(User);