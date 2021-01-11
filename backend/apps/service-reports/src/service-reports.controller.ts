import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IReportCreateResponse } from './interfaces/report-create-response.interface';
import { IReportsAllResponse } from './interfaces/report-get-all-response.interface';
import { IReportSearchByIdResponse } from './interfaces/report-search-by-id-response.interface';
import { IReportUpdateByIdResponse } from './interfaces/report-update-by-id-response.interface';
import { IReport } from './interfaces/report.interface';
import { ReportService } from './services/reports.service';

@Controller()
export class ServiceReportsController {
  constructor(private readonly reportService: ReportService) { }

  //Create a new report
  @MessagePattern('report_create')
  public async createUser(reportParams: IReport): Promise<IReportCreateResponse> {
    let result: IReportCreateResponse;

    if (reportParams) {
      try {
        const createdVehicule = await this.reportService.createReport(reportParams);
        result = {
          status: HttpStatus.CREATED,
          message: 'report_create_success',
          report: createdVehicule,
          errors: null,
        };
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'report_create_precondition_failed',
          report: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'report_create_bad_request',
        report: null,
        errors: null,
      };
    }

    return result;
  }

  //Modify report's data
  @MessagePattern('report_modify')
  public async modifyUser(modifyParams: { id: string, report_update: IReport }): Promise<IReportUpdateByIdResponse> {
    let result: IReportUpdateByIdResponse;

    if (modifyParams) {
      const vehicule = await this.reportService.getReportById(modifyParams.id);

      if (vehicule && vehicule[0]) {
        const vehiculeId = vehicule[0].id;
        const vehiculeData = modifyParams.report_update
        const modifiedReport = await this.reportService.updateReportById(vehiculeId, {
          vehiculeData
        });
        result = {
          status: HttpStatus.OK,
          message: 'report_confirm_success',
          report: modifiedReport,
          errors: null,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'report_confirm_not_found',
          report: null,
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'report_confirm_bad_request',
        report: null,
        errors: null,
      };
    }

    return result;
  }

  //Load all reports
  @MessagePattern('report_all')
  public async LoadAllReports(): Promise<IReportsAllResponse> {
    let result: IReportsAllResponse;

    const reports = await this.reportService.getAllReports();

    if (reports || reports[0]) {
      result = {
        status: HttpStatus.OK,
        message: 'reports_all_success',
        reports,
      };
    } else {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'reports_all_not_found',
        reports,
      };
    }

    return result;
  }

  //Load repord by id
  @MessagePattern('report_by_id')
  public async LoadSingleReport(report_id: string): Promise<IReportSearchByIdResponse> {
    let result: IReportSearchByIdResponse;

    if (report_id) {
      const report = await this.reportService.getReportById(report_id);

      if (report) {
        result = {
          status: HttpStatus.OK,
          message: 'report_by_id_success',
          report,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'report_by_id_not_found',
          report: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'report_by_id_bad_request',
        report: null,
      };
    }

    return result;
  }
}
