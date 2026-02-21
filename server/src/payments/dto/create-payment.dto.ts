import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  OTHER = 'other',
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  kidId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus = PaymentStatus.PENDING;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  paymentDate?: Date;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}

export class UpdatePaymentDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  paymentDate?: Date;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
