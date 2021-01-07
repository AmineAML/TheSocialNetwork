import { IReport } from "./report.interface";

export interface IReportSearchByIdResponse {
    status: number;
    message: string;
    report: IReport | null;
}