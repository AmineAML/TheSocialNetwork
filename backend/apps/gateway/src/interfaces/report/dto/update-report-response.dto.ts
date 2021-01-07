import { IReport } from '../report.interface';

export class UpdateReportResponseDto {
  message: string;
  data: {
    report: IReport;
  };
  errors: { [key: string]: any };
}