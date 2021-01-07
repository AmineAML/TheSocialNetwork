import { IReport } from "./report.interface";

export interface IReportCreateResponse {
    status: number;
    message: string;
    report: IReport | null;
    errors: { [key: string]: any } | null;
}