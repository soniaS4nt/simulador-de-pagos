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
  
/*   @Post()
  async createPayment(@Body() paymentData: any) {
    try {
      const payment = await this.paymentService.createPayment(paymentData);
      return { success: true, data: payment };
    } catch (error) {
      throw new HttpException('Error processing payment', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    const payment = await this.paymentService.getPayment(id);
    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return { success: true, data: payment };
  }

  @Get()
  async getAllPayments() {
    const payments = await this.paymentService.getAllPayments();
    return { success: true, data: payments };
  }

  @Put(':id/status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('status') status: Payment['status'],
  ) {
    const payment = await this.paymentService.updatePaymentStatus(id, status);
    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return { success: true, data: payment };
  } */
}