import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { CreatePaymentDto, UpdatePaymentDto, PaymentStatus } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const createdPayment = new this.paymentModel({
      ...createPaymentDto,
      status: createPaymentDto.status || PaymentStatus.PENDING,
      paymentDate: createPaymentDto.paymentDate || new Date(),
    });
    return createdPayment.save();
  }

  async findAllByKid(kidId: string): Promise<Payment[]> {
    return this.paymentModel.find({ kidId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const existingPayment = await this.paymentModel
      .findByIdAndUpdate(
        id,
        { ...updatePaymentDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!existingPayment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return existingPayment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }

  async getPaymentSummary(kidId: string) {
    const [totalPayments, paidPayments, pendingPayments] = await Promise.all([
      this.paymentModel.countDocuments({ kidId }),
      this.paymentModel.countDocuments({ kidId, status: PaymentStatus.PAID }),
      this.paymentModel.countDocuments({ 
        kidId, 
        status: { $in: [PaymentStatus.PENDING, PaymentStatus.FAILED] } 
      }),
    ]);

    const totalAmount = await this.paymentModel.aggregate([
      { $match: { kidId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      totalPayments,
      paidPayments,
      pendingPayments,
      totalAmount: totalAmount[0]?.total || 0,
    };
  }
}
