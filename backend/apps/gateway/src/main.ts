import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const logger = new Logger('API Gateway')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigService).get('API_GATEWAY_PORT')
  app.setGlobalPrefix('api/v1')
  await app.listen(port);
  logger.log(`Listening on port ${port}`)
}
bootstrap();