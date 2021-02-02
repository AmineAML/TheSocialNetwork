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
const service_mailer_module_1 = __webpack_require__(5);
const logger = new common_1.Logger('Mailer');
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(service_mailer_module_1.ServiceMailerModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            url: new config_1.ConfigService().get('NODE_ENV') === 'production' ? new config_1.ConfigService().get('REDIS_PROD') : new config_1.ConfigService().get('REDIS_ACCOUNT_SERVICE_URL')
        }
    });
    await app.listen(() => logger.log('Microservice mailer is listening'));
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
exports.ServiceMailerModule = void 0;
const common_1 = __webpack_require__(1);
const service_mailer_controller_1 = __webpack_require__(6);
const nest_sendgrid_1 = __webpack_require__(7);
const config_1 = __webpack_require__(2);
let ServiceMailerModule = class ServiceMailerModule {
};
ServiceMailerModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            nest_sendgrid_1.SendGridModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configServoce) => ({
                    apikey: configServoce.get('SENDGRID_API_KEY')
                }),
                inject: [config_1.ConfigService]
            })
        ],
        controllers: [service_mailer_controller_1.ServiceMailerController],
        providers: [],
    })
], ServiceMailerModule);
exports.ServiceMailerModule = ServiceMailerModule;


/***/ }),
/* 6 */
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
exports.ServiceMailerController = void 0;
const nest_sendgrid_1 = __webpack_require__(7);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(4);
const email_data_interface_1 = __webpack_require__(8);
const logger = new common_1.Logger('MAILER');
let ServiceMailerController = class ServiceMailerController {
    constructor(sendGrid, configService) {
        this.sendGrid = sendGrid;
        this.configService = configService;
    }
    async mailSendConfirmEmail(data) {
        let result = null;
        const enabled = this.configService.get('ENABLE_MAILER');
        console.log(enabled);
        if (enabled) {
            await this.sendGrid.send(data).then(() => {
                logger.log('Confirm account email sent');
                result = {
                    status: common_1.HttpStatus.ACCEPTED,
                    message: 'mail_send_confirm_email_success'
                };
            }).catch(e => {
                logger.error(`Couldn't send account confirmation email: ${e}`);
                result = {
                    status: common_1.HttpStatus.NOT_ACCEPTABLE,
                    message: 'mail_send_confirm_email_failed_to_send'
                };
            });
        }
        return result;
    }
    async mailSendWelcomeTutorial(data) {
        let result;
        const enabled = this.configService.get('ENABLE_MAILER');
        console.log(enabled);
        if (enabled) {
            await this.sendGrid.send(data).then(() => {
                logger.log('Confirm account email sent');
                result = {
                    status: common_1.HttpStatus.ACCEPTED,
                    message: 'mail_send_confirm_email_success'
                };
            }).catch(e => {
                logger.error(`Couldn't send account confirmation email: ${e}`);
                result = {
                    status: common_1.HttpStatus.NOT_ACCEPTABLE,
                    message: 'mail_send_confirm_email_failed_to_send'
                };
            });
        }
        return result;
    }
};
__decorate([
    microservices_1.MessagePattern('mail_send_confirm_email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof email_data_interface_1.IEmailData !== "undefined" && email_data_interface_1.IEmailData) === "function" ? _a : Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], ServiceMailerController.prototype, "mailSendConfirmEmail", null);
__decorate([
    microservices_1.MessagePattern('mail_send_welcome_tutorial'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof email_data_interface_1.IEmailData !== "undefined" && email_data_interface_1.IEmailData) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ServiceMailerController.prototype, "mailSendWelcomeTutorial", null);
ServiceMailerController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [typeof (_e = typeof nest_sendgrid_1.SendGridService !== "undefined" && nest_sendgrid_1.SendGridService) === "function" ? _e : Object, typeof (_f = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _f : Object])
], ServiceMailerController);
exports.ServiceMailerController = ServiceMailerController;


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@anchan828/nest-sendgrid");;

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


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