import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Avatar extends Document {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true, unique: true })
  url: string;
}
