import { IReport } from './report.interface';

export interface IServiceGetAllReportsResponse {
  status: number;
  message: string;
  reports: IReport[] | null;
}