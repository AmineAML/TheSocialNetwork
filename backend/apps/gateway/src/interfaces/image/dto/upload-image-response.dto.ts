import { IImage } from '../image.interface';

export class UploadImageResponseDto {
  message: string;
  data: {
    images: IImage | IImage[];
  };
  errors: { [key: string]: any };
}