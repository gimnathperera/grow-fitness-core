import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CollectInfoDocument = CollectInfo &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class CollectInfo {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  planType: string;

  @Prop({ default: 'pending' })
  status: string; // pending, contacted, converted, rejected

  @Prop()
  notes?: string;

  @Prop()
  contactedAt?: Date;

  @Prop()
  convertedAt?: Date;

  @Prop()
  rejectedAt?: Date;

  @Prop()
  rejectionReason?: string;
}

export const CollectInfoSchema = SchemaFactory.createForClass(CollectInfo);
