import { IUser } from './user.interface';

export interface IUserSearchQueryResponse {
    status: number;
    message: string;
    users: IUser[] | null;
    meta: {
        itemCount: number;
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    },
    link: {
        first: string;
        previous: string;
        next: string;
        last: string;
    }
}