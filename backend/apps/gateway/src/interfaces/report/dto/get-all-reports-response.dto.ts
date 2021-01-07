import { IReport } from '../report.interface';

export class GetAllReportsResponseDto {
  message: string;
  data: {
    reports: IReport[];
  };
  errors: { [key: string]: any };
}