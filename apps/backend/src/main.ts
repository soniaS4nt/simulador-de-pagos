import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Simulador de Pagos - Zippy Pay')
    .setDescription('Descripción de la API,  sus endpoints, parámetros y respuestas del backend.')
    .setVersion('0.1')
    .addTag('Pagos')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors();
  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(`🚀 Server is running on port ${port}.`);
}
bootstrap();
