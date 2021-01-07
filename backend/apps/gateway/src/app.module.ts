import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientOptions, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AccountsController } from './account.controller';
import { config } from './services/config/config';
import { Configs } from './services/config/config.service';
import { ReportController } from './report.controller';
import { ImageController } from './image.controller';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    })
  ],
  controllers: [
    AccountsController, 
    ReportController, 
    ImageController
  ],
  providers: [
    ConfigService,
    AuthGuard,
    RolesGuard,
    {
      provide: 'ACCOUNT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const accountServiceOptions: ClientOptions = {
          options: {
            url: configService.get<string>('REDIS_ACCOUNT_SERVICE_URL')
          },
          transport: Transport.REDIS
        }
        console.log(accountServiceOptions)
        return ClientProxyFactory.create(accountServiceOptions)
      },
      inject: [ConfigService]
    },
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const authServiceOptions: ClientOptions = {
          options: {
            url: configService.get<string>('REDIS_ACCOUNT_SERVICE_URL')
          },
          transport: Transport.REDIS
        }
        console.log(authServiceOptions)
        return ClientProxyFactory.create(authServiceOptions)
      },
      inject: [ConfigService]
    },
    {
      provide: 'REPORT_SERVICE',
      useFactory: (configService: ConfigService) => {
        const authServiceOptions: ClientOptions = {
          options: {
            url: configService.get<string>('REDIS_ACCOUNT_SERVICE_URL')
          },
          transport: Transport.REDIS
        }
        console.log(authServiceOptions)
        return ClientProxyFactory.create(authServiceOptions)
      },
      inject: [ConfigService]
    },
    {
      provide: 'IMAGE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const authServiceOptions: ClientOptions = {
          options: {
            url: configService.get<string>('REDIS_ACCOUNT_SERVICE_URL')
          },
          transport: Transport.REDIS
        }
        console.log(authServiceOptions)
        return ClientProxyFactory.create(authServiceOptions)
      },
      inject: [ConfigService]
    }
  ],
})
export class AppModule { }
