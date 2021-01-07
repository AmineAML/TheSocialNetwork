import { IImage } from "./image.interface";

export interface IImageSearchResponse {
    status: number;
    message: string;
    image: IImage | IImage[] | null;
}