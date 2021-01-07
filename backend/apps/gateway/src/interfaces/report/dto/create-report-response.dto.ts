import { IReport } from "../report.interface";

export class CreateReportResponseDto {
  message: string;
  data: {
    report: IReport;
  };
  errors: { [key: string]: any };
}