export interface IImageConfirmResponse {
    status: number;
    message: string;
    errors: { [key: string]: any } | null;
}