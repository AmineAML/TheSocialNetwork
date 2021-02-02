import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ServiceAccountModule } from './service-account.module';

const logger = new Logger('Account')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ServiceAccountModule, {
    transport: Transport.REDIS,
    options: {
      url: new ConfigService().get<string>('NODE_ENV') === 'production' ? new ConfigService().get('REDIS_PROD') : new ConfigService().get<string>('REDIS_ACCOUNT_SERVICE_URL')
    }
  } as RedisOptions)
  await app.listen(() => logger.log('Microservice account is listening'))
}
bootstrap();
