import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Avatar } from 'src/aws/schemas/avatar.schema';

@Schema({ _id: false })
export class UserShort extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  protected: boolean;

  @Prop({ type: Avatar })
  avatar: Avatar;
}

export const UserShortSchema = SchemaFactory.createForClass(UserShort);
