export interface IChangePasswordResponse {
    status: number;
    message: string;
    errors: { [key: string]: any } | null;
}