import { IImage } from './image.interface';

export interface IServiceImageUploadResponse {
  status: number;
  message: string;
  images: IImage | IImage[] | null;
  errors: { [key: string]: any };
}