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
const service_auth_module_1 = __webpack_require__(5);
const logger = new common_1.Logger('Auth');
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(service_auth_module_1.ServiceAuthModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            url: new config_1.ConfigService().get('NODE_ENV') === 'production' ? new config_1.ConfigService().get('REDIS_PROD') : new config_1.ConfigService().get('REDIS_ACCOUNT_SERVICE_URL')
        }
    });
    await app.listen(() => logger.log('Microservice auth is listening'));
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
exports.ServiceAuthModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const jwt_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const token_schema_1 = __webpack_require__(8);
const service_auth_controller_1 = __webpack_require__(10);
const token_service_1 = __webpack_require__(11);
let ServiceAuthModule = class ServiceAuthModule {
};
ServiceAuthModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({}),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('NODE_ENV') === 'production' ? configService.get('MONGO_AUTH_PROD') : `mongodb://${configService.get('MONGO_AUTH_USERNAME')}:${encodeURIComponent(configService.get('MONGO_AUTH_PASSWORD'))}@${configService.get('MONGO_AUTH_HOST')}:${configService.get('MONGO_AUTH_PORT')}/${configService.get('MONGO_AUTH_DATABASE')}`,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Token',
                    schema: token_schema_1.TokenSchema
                }
            ])
        ],
        controllers: [service_auth_controller_1.ServiceAuthController],
        providers: [token_service_1.TokenService],
    })
], ServiceAuthModule);
exports.ServiceAuthModule = ServiceAuthModule;


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");;

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");;

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenSchema = void 0;
const mongoose = __webpack_require__(9);
function transformValue(doc, ret) {
    delete ret._id;
}
exports.TokenSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'User can not be empty'],
    },
    refresh_token: {
        type: String,
        required: [true, 'Refresh token can not be empty'],
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
});


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("mongoose");;

/***/ }),
/* 10 */
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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceAuthController = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(4);
const token_service_1 = __webpack_require__(11);
let ServiceAuthController = class ServiceAuthController {
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async createToken(data) {
        let result;
        if (data) {
            try {
                const createResult = await this.tokenService.createToken(data);
                result = {
                    status: common_1.HttpStatus.CREATED,
                    message: 'token_create_success',
                    access_token: createResult.access_token,
                    refresh_token: createResult.refresh_token,
                };
            }
            catch (e) {
                result = {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'token_create_bad_request',
                    access_token: null,
                    refresh_token: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'token_create_bad_request',
                access_token: null,
                refresh_token: null,
            };
        }
        return result;
    }
    async loggedIn(data) {
        console.log(data);
        const tokenData = await this.tokenService.validateToken(data.access_token);
        console.log(tokenData);
        return {
            status: tokenData ? common_1.HttpStatus.OK : common_1.HttpStatus.UNAUTHORIZED,
            message: tokenData ? 'token_validate_success' : 'token_validate_unauthorized',
            data: tokenData,
        };
    }
    async refreshToken(refresh_token) {
        let result;
        if (refresh_token) {
            try {
                console.log(refresh_token);
                const createResult = await this.tokenService.refreshToken(refresh_token);
                console.log(createResult);
                result = {
                    status: common_1.HttpStatus.CREATED,
                    message: 'token_refresh_success',
                    access_token: createResult.access_token,
                    refresh_token: null,
                };
            }
            catch (e) {
                result = {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'token_refresh_unauthorized',
                    access_token: null,
                    refresh_token: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'token_refresh_bad_request',
                access_token: null,
                refresh_token: null,
            };
        }
        return result;
    }
    async destroyToken(data) {
        return {
            status: data && data.userId ? common_1.HttpStatus.OK : common_1.HttpStatus.BAD_REQUEST,
            message: data && data.userId ? (await this.tokenService.deleteTokenForUserId(data.userId)) && 'token_destroy_success' : 'token_destroy_bad_request',
            errors: null,
        };
    }
};
__decorate([
    microservices_1.MessagePattern('token_create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], ServiceAuthController.prototype, "createToken", null);
__decorate([
    microservices_1.MessagePattern('token_validate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], ServiceAuthController.prototype, "loggedIn", null);
__decorate([
    microservices_1.MessagePattern('token_refresh'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ServiceAuthController.prototype, "refreshToken", null);
__decorate([
    microservices_1.MessagePattern('token_destroy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ServiceAuthController.prototype, "destroyToken", null);
ServiceAuthController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [typeof (_e = typeof token_service_1.TokenService !== "undefined" && token_service_1.TokenService) === "function" ? _e : Object])
], ServiceAuthController);
exports.ServiceAuthController = ServiceAuthController;


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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenService = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(9);
const config_1 = __webpack_require__(2);
const bcrypt = __webpack_require__(12);
const logger = new common_1.Logger('Auth');
let TokenService = class TokenService {
    constructor(jwtService, tokenModel, configService) {
        this.jwtService = jwtService;
        this.tokenModel = tokenModel;
        this.configService = configService;
        this.jwt_access_token_secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
        this.jwt_refresh_token_secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET');
        this.SALT_ROUNDS = Number(this.configService.get('BCRYPT_SALT_ROUNDS'));
    }
    async createToken(data) {
        const access_token = await this.signToken(data.userId, data.role, '180s', this.jwt_access_token_secret);
        const refresh_token = await this.signToken(data.userId, data.role, '1h', this.jwt_refresh_token_secret);
        const hashed_refresh_token = await bcrypt.hash(refresh_token, this.SALT_ROUNDS);
        await this.tokenModel.findOneAndUpdate({ 'user_id': data.userId }, { refresh_token: hashed_refresh_token }, { new: true, upsert: true });
        let newToken = {};
        newToken.access_token = access_token;
        newToken.refresh_token = refresh_token;
        return newToken;
    }
    async validateToken(access_token) {
        console.log(access_token);
        let result = null;
        try {
            const verifyJWT = this.jwtService.verify(access_token, {
                secret: this.jwt_access_token_secret
            });
            console.log(verifyJWT);
            result = verifyJWT;
        }
        catch (e) {
            logger.error(e);
            result = null;
        }
        console.log(`Rslt ${result}`);
        return result;
    }
    async refreshToken(refresh_token) {
        let result = null;
        console.log(refresh_token);
        try {
            const verifyJWT = this.jwtService.verify(refresh_token, {
                secret: this.jwt_refresh_token_secret
            });
            console.log(verifyJWT);
            const tokenModel = await this.tokenModel.findOne({
                user_id: verifyJWT.sub
            });
            console.log(tokenModel);
            if (tokenModel) {
                const isRefreshTokenMatching = await bcrypt.compare(refresh_token, tokenModel.refresh_token);
                if (isRefreshTokenMatching) {
                    const data = {
                        userId: verifyJWT.sub,
                        role: verifyJWT.role
                    };
                    const access_token = await this.signToken(data.userId, data.role, '900s', this.jwt_access_token_secret);
                    result = {
                        access_token
                    };
                }
                else {
                    result = null;
                }
            }
            else {
                result = null;
            }
        }
        catch (e) {
            logger.error(e);
            result = null;
        }
        return result;
    }
    deleteTokenForUserId(userId) {
        return this.tokenModel.remove({
            user_id: userId,
        });
    }
    async signToken(userId, role, expiresIn, secret) {
        return this.jwtService.sign({
            sub: userId,
            role: role,
        }, {
            expiresIn,
            secret
        });
    }
};
TokenService = __decorate([
    common_1.Injectable(),
    __param(1, mongoose_1.InjectModel('Token')),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], TokenService);
exports.TokenService = TokenService;


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("bcrypt");;

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