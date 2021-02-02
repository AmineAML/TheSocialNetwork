import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ServiceReportsModule } from './service-reports.module';

const logger   = new Logger('Reports')

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ServiceReportsModule, {
    transport: Transport.REDIS,
    options: {
      url: new ConfigService().get<string>('NODE_ENV') === 'production' ? new ConfigService().get('REDIS_PROD') : new ConfigService().get<string>('REDIS_ACCOUNT_SERVICE_URL')
    }
  } as RedisOptions)
  await app.listen(() => logger.log('Microservice reports is listening'))
}
bootstrap();
