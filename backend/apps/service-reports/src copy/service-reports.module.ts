import { Module } from '@nestjs/common';
import { ServiceReportsController } from './service-reports.controller';
import { ServiceReportsService } from './service-reports.service';

@Module({
  imports: [],
  controllers: [ServiceReportsController],
  providers: [ServiceReportsService],
})
export class ServiceReportsModule {}
