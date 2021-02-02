import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schemas/token.schema';
import { ServiceAuthController } from './service-auth.controller';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //load: [config]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        //secret: new ConfigService().get('JWT_SECRET'),
        //signOptions: {expiresIn: '900s'}
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('NODE_ENV') === 'production' ? configService.get('MONGO_AUTH_PROD') : `mongodb://${configService.get('MONGO_AUTH_USERNAME')}:${encodeURIComponent(configService.get('MONGO_AUTH_PASSWORD'))}@${configService.get('MONGO_AUTH_HOST')}:${configService.get('MONGO_AUTH_PORT')}/${configService.get('MONGO_AUTH_DATABASE')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'Token',
        schema: TokenSchema
      }
    ])
  ],
  controllers: [ServiceAuthController],
  providers: [TokenService],
})
export class ServiceAuthModule {}
