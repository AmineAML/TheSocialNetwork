import { IImage } from './image.interface';

export interface IServiceImagesGetByUserOrVehiculeIdResponse {
  status: number;
  message: string;
  images: IImage[] | null;
}