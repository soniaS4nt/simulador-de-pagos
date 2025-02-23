import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { FirebaseModule } from './core/firebase/firebase.module';
import { ConfigurationModule } from './core/config/configuration.module';

@Module({
  imports: [ConfigurationModule,PaymentModule, FirebaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
