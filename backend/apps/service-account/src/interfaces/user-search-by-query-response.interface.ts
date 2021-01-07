import { IUser } from './user.interface';

export interface IUserSearchQueryResponse {
    status: number;
    message: string;
    users: IUser[] | null;
}