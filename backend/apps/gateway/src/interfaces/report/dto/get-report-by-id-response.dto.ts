import { IReport } from '../report.interface';

export class GetReportByIdResponseDto {
  message: string;
  data: {
    report: IReport;
  };
  errors: { [key: string]: any };
}