
import { Injectable } from '@nestjs/common';
import { Payment, PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './create-payment.dto';

@Injectable()
export class PaymentService {

  constructor(private readonly paymentRepository: PaymentRepository) {}

  async createPayment(data: CreatePaymentDto): Promise<Payment> {
    return this.paymentRepository.create(data);
  }

}