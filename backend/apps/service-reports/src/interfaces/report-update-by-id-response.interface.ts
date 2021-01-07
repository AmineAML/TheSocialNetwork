import { IReport } from "./report.interface";

export interface IReportUpdateByIdResponse {
    status: number;
    message: string;
    report: IReport | null;
    errors: { [key: string]: any } | null;
}