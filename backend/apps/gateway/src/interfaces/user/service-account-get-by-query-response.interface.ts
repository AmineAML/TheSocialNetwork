import { IUser } from './user.interface';

export interface IServiceUsersGetByQueryResponse {
  status: number;
  message: string;
  users: IUser[] | null;
}