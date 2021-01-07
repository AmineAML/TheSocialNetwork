import { IReport } from './report.interface';

export interface IServiceReportGetByIdResponse {
  status: number;
  message: string;
  report: IReport | null;
}