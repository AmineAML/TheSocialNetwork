import { Controller, Get } from '@nestjs/common';
import { ServiceReportsService } from './service-reports.service';

@Controller()
export class ServiceReportsController {
  constructor(private readonly serviceReportsService: ServiceReportsService) {}

  @Get()
  getHello(): string {
    return this.serviceReportsService.getHello();
  }
}
