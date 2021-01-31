import { IInterest } from './interest.interface';

export interface IServiceUserGetInterestAllResponse {
  status: number;
  message: string;
  interests: IInterest[] | null;
}