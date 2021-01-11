import { Module } from '@nestjs/common';
import { ServiceMailerController } from './service-mailer.controller';
import { SendGridModule } from '@anchan828/nest-sendgrid'
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //load: [config]
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configServoce: ConfigService) => ({
        apikey: configServoce.get('SENDGRID_API_KEY')
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [ServiceMailerController],
  providers: [],
})
export class ServiceMailerModule {}
