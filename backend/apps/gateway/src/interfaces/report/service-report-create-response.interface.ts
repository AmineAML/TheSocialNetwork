import { IReport } from './report.interface';

export interface IServiceReportCreateResponse {
  status: number;
  message: string;
  report: IReport | null;
  errors: { [key: string]: any };
}