import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import firebaseConfig from './firebase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [firebaseConfig],
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
