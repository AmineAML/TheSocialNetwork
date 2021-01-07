import { IImage } from "../image.interface";

export class GetImagesByUserIdResponseDto {
  message: string;
  data: {
    images: any//IImage[];
  };
  errors: { [key: string]: any };
}