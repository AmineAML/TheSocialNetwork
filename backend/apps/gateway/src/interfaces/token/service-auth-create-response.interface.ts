export interface IServiceAuthCreateResponse {
    status: number;
    access_token: string | null;
    message: string;
    errors: { [key: string]: any };
}