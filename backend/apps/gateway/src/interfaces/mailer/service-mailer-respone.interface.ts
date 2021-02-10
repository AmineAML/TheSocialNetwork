import { IContact } from './contact.interface';

export interface IServiceContactUsResponse {
  status: number;
  message: string;
  user: IContact | null;
  errors: { [key: string]: any };
}