import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { hasRoles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CreateReportResponseDto } from './interfaces/report/dto/create-report-response.dto';
import { CreateReportDto } from './interfaces/report/dto/create-report.dto';
import { GetReportByIdResponseDto } from './interfaces/report/dto/get-report-by-id-response.dto';
import { UpdateReportResponseDto } from './interfaces/report/dto/update-report-response.dto';
import { UpdateReportDto } from './interfaces/report/dto/update-report.dto';
import { IServiceReportCreateResponse } from './interfaces/report/service-report-create-response.interface';
import { IServiceReportGetByIdResponse } from './interfaces/report/service-report-get-by-id.interface';
import { IServiceReportUpdatedByIdResponse } from './interfaces/report/service-report-update-by-id.interface';
import { GetAllReportsResponseDto } from './interfaces/report/dto/get-all-reports-response.dto';
import { IServiceGetAllReportsResponse } from './interfaces/report/service-report-get-all-reports-response.interface';
import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
import { IReport } from './interfaces/report/report.interface';

@Controller('reports')
export class ReportController {
    constructor(@Inject('REPORT_SERVICE') private readonly reportServiceClient: ClientProxy) { }

    //New report
    @hasRoles(Role.User, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('report')
    public async createReport(@Body() reportRequest: CreateReportDto, @Req() request: IAuthorizedRequest): Promise<CreateReportResponseDto> {
        reportRequest.by_user_id = request.user.id

        const createVehiculeResponse: IServiceReportCreateResponse = await this.reportServiceClient
            .send('report_create', reportRequest)
            .toPromise();
        if (createVehiculeResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(
                {
                    message: createVehiculeResponse.message,
                    data: null,
                    errors: createVehiculeResponse.errors,
                },
                createVehiculeResponse.status,
            );
        }

        return {
            message: createVehiculeResponse.message,
            data: {
                report: createVehiculeResponse.report,
            },
            errors: null,
        };
    }

    //Report by id
    @hasRoles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Get('report/:id')
    public async getReportById(@Param() report: IReport): Promise<GetReportByIdResponseDto> {
        //console.log(request)

        const ReportResponse: IServiceReportGetByIdResponse = await this.reportServiceClient
            .send('report_by_id', report.id)
            .toPromise();

        return {
            message: ReportResponse.message,
            data: {
                report: ReportResponse.report,
            },
            errors: null,
        };
    }

    //All reports
    @hasRoles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    public async getAllReports(): Promise<GetAllReportsResponseDto> {
        //console.log(request)

        const ReportResponse: IServiceGetAllReportsResponse = await this.reportServiceClient
            .send('report_all', {})
            .toPromise();

        return {
            message: ReportResponse.message,
            data: {
                reports: ReportResponse.reports,
            },
            errors: null,
        };
    }

    //Report update by id
    //@hasRoles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Put('report/:id')
    public async updateUserById(@Param('id') report_id: string, @Body() report_update: UpdateReportDto): Promise<UpdateReportResponseDto> {
        //console.log(request)
        let reportInfo: any = {}

        //console.log(report_update)

        reportInfo.report_update = report_update

        reportInfo.id = report_id

        const ReportResponse: IServiceReportUpdatedByIdResponse = await this.reportServiceClient
            .send('report_modify', reportInfo)
            .toPromise();

        return {
            message: ReportResponse.message,
            data: {
                report: ReportResponse.report,
            },
            errors: null,
        };
    }
}
