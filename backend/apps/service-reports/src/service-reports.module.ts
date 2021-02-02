import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schemas/reports.schema';
import { ServiceReportsController } from './service-reports.controller';
import { ReportService } from './services/reports.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //load: [config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('NODE_ENV') === 'production' ? configService.get('MONGO_REPORTS_PROD') : `mongodb://${configService.get('MONGO_REPORTS_USERNAME')}:${encodeURIComponent(configService.get('MONGO_REPORTS_PASSWORD'))}@${configService.get('MONGO_REPORTS_HOST')}:${configService.get('MONGO_REPORTS_PORT')}/${configService.get('MONGO_REPORTS_DATABASE')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'Report',
        schema: ReportSchema,
        collection: 'reports',
      }
    ]),
  ],
  controllers: [ServiceReportsController],
  providers: [ReportService],
})
export class ServiceReportsModule {}
