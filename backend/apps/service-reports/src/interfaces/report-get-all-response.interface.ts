import { IReport } from "./report.interface";

export interface IReportsAllResponse {
    status: number;
    message: string;
    reports: IReport[] | null;
}