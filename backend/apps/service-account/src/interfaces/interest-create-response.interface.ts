import { IInterest } from './interest.interface';

export interface IInterestCreateResponse {
    status: number;
    message: string;
    user: IInterest | null;
    errors: { [key: string]: any } | null;
}