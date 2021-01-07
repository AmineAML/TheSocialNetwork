import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
        uri: `mongodb://${configService.get('MONGO_ACCOUNT_USERNAME')}:${encodeURIComponent(configService.get('MONGO_ACCOUNT_PASSWORD'))}@${configService.get('MONGO_ACCOUNT_HOST')}:${configService.get('MONGO_ACCOUNT_PORT')}/${configService.get('MONGO_ACCOUNT_DATABASE')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true
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
    ]),
  ],
  controllers: [ServiceAccountController],
  providers: [
    UserService
  ],
})
export class ServiceAccountModule {}
