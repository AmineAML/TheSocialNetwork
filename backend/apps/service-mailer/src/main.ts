import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ServiceMailerModule } from './service-mailer.module';

const logger = new Logger('Mailer')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ServiceMailerModule, {
    transport: Transport.REDIS,
    options: {
      url: new ConfigService().get<string>('NODE_ENV') === 'production' ? new ConfigService().get('REDIS_PROD') : new ConfigService().get<string>('REDIS_ACCOUNT_SERVICE_URL')
    }
  } as RedisOptions)
  await app.listen(() => logger.log('Microservice mailer is listening'))
}
bootstrap();
