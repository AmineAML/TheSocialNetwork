export interface ITokenResponse {
    status: number;
    access_token: string | null;
    refresh_token: string | null;
    message: string;
}