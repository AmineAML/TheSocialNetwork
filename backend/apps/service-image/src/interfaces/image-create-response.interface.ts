import { IImage } from "./image.interface";

export interface IImageCreateResponse {
    status: number;
    message: string;
    images: IImage | IImage[] | null;
    errors: { [key: string]: any } | null;
}