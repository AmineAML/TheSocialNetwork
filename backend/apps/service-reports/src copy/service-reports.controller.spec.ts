import { Test, TestingModule } from '@nestjs/testing';
import { ServiceReportsController } from './service-reports.controller';
import { ServiceReportsService } from './service-reports.service';

describe('ServiceReportsController', () => {
  let serviceReportsController: ServiceReportsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServiceReportsController],
      providers: [ServiceReportsService],
    }).compile();

    serviceReportsController = app.get<ServiceReportsController>(ServiceReportsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serviceReportsController.getHello()).toBe('Hello World!');
    });
  });
});
