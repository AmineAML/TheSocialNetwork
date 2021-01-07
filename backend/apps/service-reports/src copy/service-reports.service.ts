import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceReportsService {
  getHello(): string {
    return 'Hello World!';
  }
}
