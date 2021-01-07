import { IUser } from './user.interface';

export interface IUserSearchManyByIdsResponse {
    status: number;
    message: string;
    users: IUser[] | null;
}