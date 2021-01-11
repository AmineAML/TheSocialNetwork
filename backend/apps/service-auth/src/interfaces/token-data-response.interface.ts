export interface ITokenDataResponse {
    status: number;
    message: string;
    data: { userId: string, role: string } | null;
}