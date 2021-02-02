/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const microservices_1 = __webpack_require__(4);
const service_reports_module_1 = __webpack_require__(5);
const logger = new common_1.Logger('Reports');
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(service_reports_module_1.ServiceReportsModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            url: new config_1.ConfigService().get('NODE_ENV') === 'production' ? new config_1.ConfigService().get('REDIS_PROD') : new config_1.ConfigService().get('REDIS_ACCOUNT_SERVICE_URL')
        }
    });
    await app.listen(() => logger.log('Microservice reports is listening'));
}
bootstrap();


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");;

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/config");;

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");;

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/microservices");;

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceReportsModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(6);
const reports_schema_1 = __webpack_require__(7);
const service_reports_controller_1 = __webpack_require__(9);
const reports_service_1 = __webpack_require__(11);
let ServiceReportsModule = class ServiceReportsModule {
};
ServiceReportsModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('NODE_ENV') === 'production' ? configService.get('MONGO_REPORTS_PROD') : `mongodb://${configService.get('MONGO_REPORTS_USERNAME')}:${encodeURIComponent(configService.get('MONGO_REPORTS_PASSWORD'))}@${configService.get('MONGO_REPORTS_HOST')}:${configService.get('MONGO_REPORTS_PORT')}/${configService.get('MONGO_REPORTS_DATABASE')}`,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Report',
                    schema: reports_schema_1.ReportSchema,
                    collection: 'reports',
                }
            ]),
        ],
        controllers: [service_reports_controller_1.ServiceReportsController],
        providers: [reports_service_1.ReportService],
    })
], ServiceReportsModule);
exports.ServiceReportsModule = ServiceReportsModule;


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");;

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportSchema = void 0;
const mongoose = __webpack_require__(8);
function transformValue(doc, ret) {
    delete ret._id;
}
exports.ReportSchema = new mongoose.Schema({
    by_user_id: {
        type: String,
        required: [true, 'User id can not be empty']
    },
    reported_user_id: {
        type: String,
        required: [true, 'Reported user id can not be empty']
    },
    description: {
        type: String,
        required: [true, 'Description can not be empty']
    },
    status: {
        type: String,
        required: [true, 'Status can not be empty'],
        enum: ['opened', 'closed'],
        default: 'opened'
    }
}, {
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: transformValue,
    },
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: transformValue,
    },
    timestamps: true
});


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("mongoose");;

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceReportsController = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(4);
const report_interface_1 = __webpack_require__(10);
const reports_service_1 = __webpack_require__(11);
let ServiceReportsController = class ServiceReportsController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    async createUser(reportParams) {
        let result;
        if (reportParams) {
            try {
                delete reportParams.status;
                const createdVehicule = await this.reportService.createReport(reportParams);
                result = {
                    status: common_1.HttpStatus.CREATED,
                    message: 'report_create_success',
                    report: createdVehicule,
                    errors: null,
                };
            }
            catch (e) {
                result = {
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    message: 'report_create_precondition_failed',
                    report: null,
                    errors: e.errors,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'report_create_bad_request',
                report: null,
                errors: null,
            };
        }
        return result;
    }
    async modifyUser(modifyParams) {
        let result;
        if (modifyParams) {
            const report = await this.reportService.getReportById(modifyParams.id);
            if (report) {
                const reportId = report.id;
                const reportData = modifyParams.report_update;
                const modifiedReport = await this.reportService.updateReportById(reportId, {
                    reportData
                });
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'report_confirm_success',
                    report: modifiedReport,
                    errors: null,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'report_confirm_not_found',
                    report: null,
                    errors: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'report_confirm_bad_request',
                report: null,
                errors: null,
            };
        }
        return result;
    }
    async LoadAllReports() {
        let result;
        const reports = await this.reportService.getAllReports();
        if (reports || reports[0]) {
            result = {
                status: common_1.HttpStatus.OK,
                message: 'reports_all_success',
                reports,
            };
        }
        else {
            result = {
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'reports_all_not_found',
                reports,
            };
        }
        return result;
    }
    async LoadSingleReport(id) {
        let result;
        if (id) {
            const report = await this.reportService.getReportById(id);
            if (report) {
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'report_by_id_success',
                    report,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'report_by_id_not_found',
                    report: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'report_by_id_bad_request',
                report: null,
            };
        }
        return result;
    }
};
__decorate([
    microservices_1.MessagePattern('report_create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof report_interface_1.IReport !== "undefined" && report_interface_1.IReport) === "function" ? _a : Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], ServiceReportsController.prototype, "createUser", null);
__decorate([
    microservices_1.MessagePattern('report_modify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ServiceReportsController.prototype, "modifyUser", null);
__decorate([
    microservices_1.MessagePattern('report_all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ServiceReportsController.prototype, "LoadAllReports", null);
__decorate([
    microservices_1.MessagePattern('report_by_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ServiceReportsController.prototype, "LoadSingleReport", null);
ServiceReportsController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [typeof (_f = typeof reports_service_1.ReportService !== "undefined" && reports_service_1.ReportService) === "function" ? _f : Object])
], ServiceReportsController);
exports.ServiceReportsController = ServiceReportsController;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportService = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(8);
let ReportService = class ReportService {
    constructor(reportModel) {
        this.reportModel = reportModel;
    }
    async createReport(report) {
        const reportModel = new this.reportModel(report);
        return await reportModel.save();
    }
    async updateReportById(report_id, ReportParams) {
        return this.reportModel.updateOne({ _id: report_id }, ReportParams).exec();
    }
    async getAllReports() {
        return this.reportModel.find({}).exec();
    }
    async getReportById(report_id) {
        return this.reportModel.findById(report_id).exec();
    }
};
ReportService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Report')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ReportService);
exports.ReportService = ReportService;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(0);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;