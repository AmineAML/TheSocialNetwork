export interface IServiceAuthDestroyResponse {
    status: number;
    message: string;
    errors: { [key: string]: any };
}