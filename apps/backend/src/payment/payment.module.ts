import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { FirebaseService } from 'src/core/firebase/firebase.service';
import { PaymentRepository } from './payment.repository';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, FirebaseService, PaymentRepository],
})
export class PaymentModule {}