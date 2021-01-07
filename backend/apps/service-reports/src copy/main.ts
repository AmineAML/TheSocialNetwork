import { NestFactory } from '@nestjs/core';
import { ServiceReportsModule } from './service-reports.module';

async function bootstrap() {
  const app = await NestFactory.create(ServiceReportsModule);
  await app.listen(3000);
}
bootstrap();
