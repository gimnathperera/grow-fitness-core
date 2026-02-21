import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '../dto/create-payment.dto';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Kid' })
  kidId: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ 
    type: String, 
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING 
  })
  status: PaymentStatus;

  @Prop({ 
    type: String, 
    enum: Object.values(PaymentMethod),
    required: true 
  })
  paymentMethod: PaymentMethod;

  @Prop({ type: String })
  transactionId?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Date })
  paymentDate?: Date;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
