import { Controller, Get, Post, Body, Param, Put, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createData(@Body() data: any): Promise<any> {
    const payment = await this.paymentService.createPayment(data);
    return { success: true, data: payment };
  }
 
}