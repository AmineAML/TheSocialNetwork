import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IReport } from '../interfaces/report.interface';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel('Report') private readonly reportModel: Model<IReport>
    ) { }

    //Open an issue
    public async createReport(report: IReport): Promise<IReport> {
        const reportModel = new this.reportModel(report);
        return await reportModel.save();
    }

    //Close an issue
    public async updateReportById(report_id: string, ReportParams: any ): Promise<IReport> {
        return this.reportModel.updateOne({ _id: report_id }, ReportParams).exec();
    }

    //Load all reports
    public async getAllReports(): Promise<IReport[]> {
        return this.reportModel.find({}).exec();
    }

    //Load a single report
    public async getReportById(report_id: string): Promise<IReport> {
        return this.reportModel.findById(report_id).exec();
    }
}