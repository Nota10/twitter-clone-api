import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { swaggerConfig } from './configs/swagger.config';

import { config } from 'aws-sdk';

async function bootstrap(): Promise<void> {
  const logger: Logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const baseUrl = `http://localhost:${port}/api`;
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  SwaggerModule.setup(`api/swagger/v1`, app, document);

  app.enableCors();
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port);

  logger.log(`Server is running at ${baseUrl}`);
  logger.log(`Swagger is running at ${baseUrl}/swagger/v1`);
}
bootstrap();
