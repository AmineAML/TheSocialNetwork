import { IImage } from "./image.interface";

export interface IImageSearchResponse {
    status: number;
    message: string;
    images: IImage | IImage[] | null;
}