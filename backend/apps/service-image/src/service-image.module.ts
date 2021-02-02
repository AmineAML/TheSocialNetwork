import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './schemas/image.schema';
import { ServiceImageController } from './service-image.controller';
import { ImageService } from './services/image.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //load: [config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('NODE_ENV') === 'production' ? configService.get('MONGO_IMAGE_PROD') : `mongodb://${configService.get('MONGO_IMAGE_USERNAME')}:${encodeURIComponent(configService.get('MONGO_IMAGE_PASSWORD'))}@${configService.get('MONGO_IMAGE_HOST')}:${configService.get('MONGO_IMAGE_PORT')}/${configService.get('MONGO_IMAGE_DATABASE')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'Image',
        schema: ImageSchema,
        collection: 'images',
      }
    ]),
  ],
  controllers: [ServiceImageController],
  providers: [ImageService],
})
export class ServiceImageModule {}
