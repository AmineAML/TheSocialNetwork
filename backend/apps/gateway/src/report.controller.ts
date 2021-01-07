import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from './guards/auth.guard';
import { IUser } from './interfaces/user/user.interface';
import { GetUserByTokenResponseDto } from './interfaces/user/dto/get-user-by-token-reponse.dto';
import { RolesGuard } from './guards/roles.guard';
import { hasRoles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { UpdateUserResponseDto } from './interfaces/user/dto/update-user-response.dto';
import { UpdateUserDto } from './interfaces/user/dto/update-user.dto';
import { IServiceUserGetByIdResponse } from './interfaces/user/service-account-get-by-id-response.interface';
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

@UseGuards(RolesGuard)
@Controller('reports')
export class ReportController {
    constructor(@Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
        @Inject('REPORT_SERVICE') private readonly reportServiceClient: ClientProxy) { }

    //New report
    @UseGuards(AuthGuard)
    @Post('report')
    public async createReport(@Body() reportRequest: CreateReportDto): Promise<CreateReportResponseDto> {
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
    @UseGuards(AuthGuard)
    @hasRoles(Role.Admin)
    @Get(':id')
    public async getReportById(@Param() id: string): Promise<GetReportByIdResponseDto> {
        //console.log(request)

        const ReportResponse: IServiceReportGetByIdResponse = await this.reportServiceClient
            .send('report_by_id', id)
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
    @UseGuards(AuthGuard)
    @hasRoles(Role.Admin)
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
    @UseGuards(AuthGuard)
    @hasRoles(Role.Admin)
    @Put('report/:id')
    public async updateUserById(@Param('id') report_id: string, @Body() report_update: UpdateReportDto): Promise<UpdateReportResponseDto> {
        //console.log(request)
        let reportInfo: any = {}

        console.log(report_update)

        reportInfo.report_update = report_update

        reportInfo.id = report_id

        const ReportResponse: IServiceReportUpdatedByIdResponse = await this.reportServiceClient
            .send('vehicule_modify', reportInfo)
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
