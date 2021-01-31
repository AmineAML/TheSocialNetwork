import { IInterest } from './interest.interface';

export interface IInterestAllResponse {
    status: number;
    message: string;
    interests:  IInterest[] | null;
}