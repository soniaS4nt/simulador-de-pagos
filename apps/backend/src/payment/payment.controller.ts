import { Controller, Get, Post, Body, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './create-payment.dto';
import { Payment } from './payment.repository';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createData(@Body() data: CreatePaymentDto): Promise<{success:boolean,data:Payment}> {
    const payment = await this.paymentService.createPayment(data);
    return { success: true, data: payment };
  }
 
}