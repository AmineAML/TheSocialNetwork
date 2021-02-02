import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientOptions, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { InterestSchema } from './schemas/interest.schema';
import { UserLinkSchema } from './schemas/user-link.schema';
import { UserSchema } from './schemas/user.schema';
import { ServiceAccountController } from './service-account.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //load: [config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('NODE_ENV') === 'production' ? configService.get('MONGO_ACCOUNT_PROD') : `mongodb://${configService.get('MONGO_ACCOUNT_USERNAME')}:${encodeURIComponent(configService.get('MONGO_ACCOUNT_PASSWORD'))}@${configService.get('MONGO_ACCOUNT_HOST')}:${configService.get('MONGO_ACCOUNT_PORT')}/${configService.get('MONGO_ACCOUNT_DATABASE')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'users',
      },
      {
        name: 'UserLink',
        schema: UserLinkSchema,
        collection: 'user_links',
      },
      {
        name: 'Interest',
        schema: InterestSchema,
        collection: 'interests',
      },
    ])
  ],
  controllers: [ServiceAccountController],
  providers: [
    UserService,
    {
      provide: 'MAILER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const mailerServiceOptions: ClientOptions = {
          options: {
            url: configService.get<string>('NODE_ENV') === 'production' ? configService.get('REDIS_PROD') : configService.get<string>('REDIS_ACCOUNT_SERVICE_URL')
          },
          transport: Transport.REDIS
        }
        console.log(mailerServiceOptions)
        return ClientProxyFactory.create(mailerServiceOptions)
      },
      inject: [ConfigService]
    },
  ],
})
export class ServiceAccountModule {}
