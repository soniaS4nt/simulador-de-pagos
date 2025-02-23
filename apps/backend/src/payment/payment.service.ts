
import { Injectable } from '@nestjs/common';
import {FirebaseService } from '../core/firebase/firebase.service'
import { Payment, PaymentRepository } from './payment.repository';

  
  @Injectable()
  export class PaymentService {
  
      constructor(private readonly paymentRepository: PaymentRepository) {}
    
      async createPayment(data: any): Promise<Payment> {
        return this.paymentRepository.create(data);
      }
    
      async findUserPayments(userId: string): Promise<Payment[]> {
        return this.paymentRepository.findByUserId(userId);
      }
    
      async updatePaymentStatus(id: string, status: Payment['status']): Promise<Payment> {
        return this.paymentRepository.update(id, { status });
      }
  
  
  }