import { IReport } from './report.interface';

export interface IServiceReportUpdatedByIdResponse {
  status: number;
  message: string;
  report: IReport | null;
}