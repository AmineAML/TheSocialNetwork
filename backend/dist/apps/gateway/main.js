/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const logger = new common_1.Logger('API Gateway');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = app.get(config_1.ConfigService).get('API_GATEWAY_PORT');
    app.setGlobalPrefix('api/v1');
    await app.listen(port, () => logger.log(`Listening on port ${port}`));
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(5);
const account_controller_1 = __webpack_require__(6);
const report_controller_1 = __webpack_require__(18);
const image_controller_1 = __webpack_require__(22);
const auth_guard_1 = __webpack_require__(12);
const roles_guard_1 = __webpack_require__(13);
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            })
        ],
        controllers: [
            account_controller_1.AccountsController,
            report_controller_1.ReportController,
            image_controller_1.ImageController
        ],
        providers: [
            config_1.ConfigService,
            auth_guard_1.AuthGuard,
            roles_guard_1.RolesGuard,
            {
                provide: 'ACCOUNT_SERVICE',
                useFactory: (configService) => {
                    const accountServiceOptions = {
                        options: {
                            url: configService.get('NODE_ENV') === 'production' ? configService.get('REDIS_PROD') : configService.get('REDIS_ACCOUNT_SERVICE_URL')
                        },
                        transport: microservices_1.Transport.REDIS
                    };
                    console.log(accountServiceOptions);
                    return microservices_1.ClientProxyFactory.create(accountServiceOptions);
                },
                inject: [config_1.ConfigService]
            },
            {
                provide: 'AUTH_SERVICE',
                useFactory: (configService) => {
                    const authServiceOptions = {
                        options: {
                            url: configService.get('NODE_ENV') === 'production' ? configService.get('REDIS_PROD') : configService.get('REDIS_ACCOUNT_SERVICE_URL')
                        },
                        transport: microservices_1.Transport.REDIS
                    };
                    console.log(authServiceOptions);
                    return microservices_1.ClientProxyFactory.create(authServiceOptions);
                },
                inject: [config_1.ConfigService]
            },
            {
                provide: 'REPORT_SERVICE',
                useFactory: (configService) => {
                    const authServiceOptions = {
                        options: {
                            url: configService.get('NODE_ENV') === 'production' ? configService.get('REDIS_PROD') : configService.get('REDIS_ACCOUNT_SERVICE_URL')
                        },
                        transport: microservices_1.Transport.REDIS
                    };
                    console.log(authServiceOptions);
                    return microservices_1.ClientProxyFactory.create(authServiceOptions);
                },
                inject: [config_1.ConfigService]
            },
            {
                provide: 'IMAGE_SERVICE',
                useFactory: (configService) => {
                    const authServiceOptions = {
                        options: {
                            url: configService.get('NODE_ENV') === 'production' ? configService.get('REDIS_PROD') : configService.get('REDIS_ACCOUNT_SERVICE_URL')
                        },
                        transport: microservices_1.Transport.REDIS
                    };
                    console.log(authServiceOptions);
                    return microservices_1.ClientProxyFactory.create(authServiceOptions);
                },
                inject: [config_1.ConfigService]
            }
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/microservices");;

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountsController = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(5);
const authorized_request_interface_1 = __webpack_require__(7);
const create_user_dto_1 = __webpack_require__(8);
const login_user_dto_1 = __webpack_require__(9);
const update_user_dto_1 = __webpack_require__(10);
const user_interface_1 = __webpack_require__(11);
const auth_guard_1 = __webpack_require__(12);
const roles_guard_1 = __webpack_require__(13);
const roles_decorator_1 = __webpack_require__(14);
const role_enum_1 = __webpack_require__(15);
const confirm_user_dto_1 = __webpack_require__(16);
const user_is_user_guard_1 = __webpack_require__(17);
let AccountsController = class AccountsController {
    constructor(accountServiceClient, authServiceClient) {
        this.accountServiceClient = accountServiceClient;
        this.authServiceClient = authServiceClient;
    }
    async createUser(userRequest) {
        userRequest.role = role_enum_1.Role.User;
        const createUserResponse = await this.accountServiceClient
            .send('user_create', userRequest)
            .toPromise();
        if (createUserResponse.status !== common_1.HttpStatus.CREATED) {
            throw new common_1.HttpException({
                message: createUserResponse.message,
                data: null,
                errors: createUserResponse.errors,
            }, createUserResponse.status);
        }
        const createTokenResponse = await this.authServiceClient.send('token_create', {
            userId: createUserResponse.user.id,
            role: createUserResponse.user.role,
        })
            .toPromise();
        return {
            message: createUserResponse.message,
            data: {
                user: createUserResponse.user,
                access_token: createTokenResponse.access_token,
                refresh_token: createTokenResponse.refresh_token
            },
            errors: {
                user_error: createUserResponse.errors,
                token_error: createTokenResponse.errors
            },
        };
    }
    async getUserById(user) {
        const userInfo = user;
        const userResponse = await this.accountServiceClient
            .send('user_get_by_id', userInfo.id)
            .toPromise();
        return {
            message: userResponse.message,
            data: {
                user: userResponse.user,
            },
            errors: null,
        };
    }
    async getUserByUsername(user) {
        const userInfo = user;
        const userResponse = await this.accountServiceClient
            .send('user_get_by_username', userInfo.username)
            .toPromise();
        return {
            message: userResponse.message,
            data: {
                user: userResponse.user,
            },
            errors: null,
        };
    }
    async getUserByToken(request) {
        const userInfo = request.user;
        const userResponse = await this.accountServiceClient
            .send('user_get_by_id', userInfo.id)
            .toPromise();
        return {
            message: userResponse.message,
            data: {
                user: userResponse.user,
            },
            errors: null,
        };
    }
    async updateUserById(user_id, user_update, request) {
        if (!(user_id == request.user.id)) {
            throw new common_1.HttpException({
                message: null,
                data: null,
                errors: null,
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        let userInfo = {};
        console.log(user_update);
        user_update.role ? delete user_update.role : '';
        userInfo.user_update = user_update;
        userInfo.user_id = user_id;
        const userResponse = await this.accountServiceClient
            .send('user_modify_profile', userInfo)
            .toPromise();
        return {
            message: userResponse.message,
            data: {
                user: userResponse.user,
            },
            errors: null,
        };
    }
    async getUsersByQuery(search_term, page = 1, limit = 10) {
        page = Number(page);
        limit = Number(limit);
        limit = limit > 100 ? 100 : limit;
        console.log(search_term);
        let match = {};
        search_term ? match.search_term = search_term.toLowerCase() : match;
        let usersResponse;
        if (match) {
            usersResponse = await this.accountServiceClient
                .send('users_search_by_query', {
                match,
                page,
                limit,
                route: `http://localhost:3000/api/v1/users/query?search_term=${search_term}`
            })
                .toPromise();
        }
        return {
            message: usersResponse.message,
            data: {
                users: usersResponse.users,
                meta: usersResponse.meta,
                link: usersResponse.link
            },
            errors: null,
        };
    }
    async ree() {
        return {
            message: 'get_ree_success',
            data: {
                ree: 'Reeeeee'
            },
            errors: null,
        };
    }
    async loginUser(loginRequest) {
        const getUserResponse = await this.accountServiceClient
            .send('user_search_by_credentials', loginRequest)
            .toPromise();
        if (getUserResponse.status !== common_1.HttpStatus.OK) {
            throw new common_1.HttpException({
                message: getUserResponse.message,
                data: null,
                errors: null,
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
        const createTokenResponse = await this.authServiceClient
            .send('token_create', {
            userId: getUserResponse.user.id,
            role: getUserResponse.user.role,
        })
            .toPromise();
        return {
            message: createTokenResponse.message,
            data: {
                access_token: createTokenResponse.access_token,
                refresh_token: createTokenResponse.refresh_token
            },
            errors: null,
        };
    }
    async refreshToken(req, token) {
        const refresh_token = token.refresh_token;
        console.log(refresh_token);
        const refreshTokenResponse = await this.authServiceClient
            .send('token_refresh', refresh_token)
            .toPromise();
        return {
            message: refreshTokenResponse.message,
            data: {
                access_token: refreshTokenResponse.access_token,
            },
            errors: null,
        };
    }
    async logoutUser(request) {
        const userInfo = request.user;
        const destroyTokenResponse = await this.authServiceClient
            .send('token_destroy', {
            userId: userInfo.id,
        })
            .toPromise();
        if (destroyTokenResponse.status !== common_1.HttpStatus.OK) {
            throw new common_1.HttpException({
                message: destroyTokenResponse.message,
                data: null,
                errors: destroyTokenResponse.errors,
            }, destroyTokenResponse.status);
        }
        return {
            message: destroyTokenResponse.message,
            errors: null,
            data: null,
        };
    }
    async confirmUser(params) {
        const confirmUserResponse = await this.accountServiceClient
            .send('user_confirm', {
            link: params.link,
        })
            .toPromise();
        if (confirmUserResponse.status !== common_1.HttpStatus.OK) {
            throw new common_1.HttpException({
                message: confirmUserResponse.message,
                data: null,
                errors: confirmUserResponse.errors,
            }, confirmUserResponse.status);
        }
        return {
            message: confirmUserResponse.message,
            errors: null,
            data: null,
        };
    }
    async getTopInterests() {
        const interestResponse = await this.accountServiceClient
            .send('interest_get_all', {})
            .toPromise();
        return {
            message: interestResponse.message,
            data: {
                interests: interestResponse.interests,
            },
            errors: null,
        };
    }
};
__decorate([
    common_1.Post('user'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _a : Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], AccountsController.prototype, "createUser", null);
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.User, role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Get('user/id/:id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof user_interface_1.IUser !== "undefined" && user_interface_1.IUser) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], AccountsController.prototype, "getUserById", null);
__decorate([
    common_1.Get('user/username/:username'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof user_interface_1.IUser !== "undefined" && user_interface_1.IUser) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], AccountsController.prototype, "getUserByUsername", null);
__decorate([
    common_1.Get('user'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof authorized_request_interface_1.IAuthorizedRequest !== "undefined" && authorized_request_interface_1.IAuthorizedRequest) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], AccountsController.prototype, "getUserByToken", null);
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.User, role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard, user_is_user_guard_1.UserIsUserGuard),
    common_1.Put('user/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()), __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_j = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _j : Object, typeof (_k = typeof authorized_request_interface_1.IAuthorizedRequest !== "undefined" && authorized_request_interface_1.IAuthorizedRequest) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], AccountsController.prototype, "updateUserById", null);
__decorate([
    common_1.Get('query'),
    roles_decorator_1.hasRoles(role_enum_1.Role.User, role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Query('search_term')), __param(1, common_1.Query('page')), __param(2, common_1.Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], AccountsController.prototype, "getUsersByQuery", null);
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.User, role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Get('ree'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], AccountsController.prototype, "ree", null);
__decorate([
    common_1.Post('/login'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof login_user_dto_1.LoginUserDto !== "undefined" && login_user_dto_1.LoginUserDto) === "function" ? _p : Object]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], AccountsController.prototype, "loginUser", null);
__decorate([
    common_1.Post('/refresh_token'),
    __param(0, common_1.Req()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof Request !== "undefined" && Request) === "function" ? _r : Object, Object]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], AccountsController.prototype, "refreshToken", null);
__decorate([
    common_1.UseGuards(auth_guard_1.AuthGuard),
    common_1.Put('/logout'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof authorized_request_interface_1.IAuthorizedRequest !== "undefined" && authorized_request_interface_1.IAuthorizedRequest) === "function" ? _t : Object]),
    __metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
], AccountsController.prototype, "logoutUser", null);
__decorate([
    common_1.Get('/confirm/:link'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_v = typeof confirm_user_dto_1.ConfirmUserDto !== "undefined" && confirm_user_dto_1.ConfirmUserDto) === "function" ? _v : Object]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], AccountsController.prototype, "confirmUser", null);
__decorate([
    common_1.Get('interests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], AccountsController.prototype, "getTopInterests", null);
AccountsController = __decorate([
    common_1.Controller('users'),
    __param(0, common_1.Inject('ACCOUNT_SERVICE')),
    __param(1, common_1.Inject('AUTH_SERVICE')),
    __metadata("design:paramtypes", [typeof (_y = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _y : Object, typeof (_z = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _z : Object])
], AccountsController);
exports.AccountsController = AccountsController;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUserDto = void 0;
class LoginUserDto {
}
exports.LoginUserDto = LoginUserDto;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 12 */
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
exports.AuthGuard = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(5);
const logger = new common_1.Logger('Gateway');
let AuthGuard = class AuthGuard {
    constructor(authServiceClient) {
        this.authServiceClient = authServiceClient;
    }
    async canActivate(context) {
        var _a, _b;
        const req = context.switchToHttp().getRequest();
        try {
            console.log((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
            const res = await this.authServiceClient.send('token_validate', { access_token: (_b = req.headers['authorization']) === null || _b === void 0 ? void 0 : _b.split(' ')[1] })
                .toPromise();
            console.log(res);
            if (res.status !== common_1.HttpStatus.OK) {
                console.log('UnAuthorized');
                throw new common_1.HttpException({
                    message: res.message,
                    statusCode: res.status
                }, res.status);
            }
            const user = {
                id: res.data.sub,
                role: res.data.role
            };
            req.user = user;
            return res;
        }
        catch (err) {
            logger.error(err);
            throw new common_1.UnauthorizedException();
        }
    }
};
AuthGuard = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('AUTH_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], AuthGuard);
exports.AuthGuard = AuthGuard;


/***/ }),
/* 13 */
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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(3);
const logger = new common_1.Logger('Gateway');
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    async canActivate(context) {
        const roles = this.reflector.get('roles', context.getHandler());
        console.log(roles);
        console.log(!roles);
        if (!roles) {
            return true;
        }
        try {
            const req = context.switchToHttp().getRequest();
            const user = req.user;
            const authorized = this.matchRoles(roles, user.role);
            console.log(`Is authorized ${authorized}`);
            return authorized;
        }
        catch (err) {
            logger.error(err);
            return false;
        }
    }
    matchRoles(requiredRoles, userRole) {
        let isMatchedRole = false;
        requiredRoles.forEach(role => {
            if (userRole.includes(role)) {
                isMatchedRole = true;
            }
        });
        return isMatchedRole;
    }
};
RolesGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);
exports.RolesGuard = RolesGuard;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasRoles = exports.ROLES_KEY = void 0;
const common_1 = __webpack_require__(1);
exports.ROLES_KEY = 'roles';
exports.hasRoles = (...hasRoles) => common_1.SetMetadata(exports.ROLES_KEY, hasRoles);


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = void 0;
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["User"] = "user";
})(Role = exports.Role || (exports.Role = {}));


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfirmUserDto = void 0;
class ConfirmUserDto {
}
exports.ConfirmUserDto = ConfirmUserDto;


/***/ }),
/* 17 */
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
exports.UserIsUserGuard = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(5);
let UserIsUserGuard = class UserIsUserGuard {
    constructor(accountServiceClient) {
        this.accountServiceClient = accountServiceClient;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const userId = request.user.id;
        const userResponse = await this.accountServiceClient
            .send('user_get_by_id', userId)
            .toPromise();
        let hasPermission = false;
        if (userResponse.user) {
            if (userResponse.user.id === params.id) {
                hasPermission = true;
            }
        }
        return hasPermission;
    }
};
UserIsUserGuard = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('ACCOUNT_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _a : Object])
], UserIsUserGuard);
exports.UserIsUserGuard = UserIsUserGuard;


/***/ }),
/* 18 */
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportController = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(5);
const auth_guard_1 = __webpack_require__(12);
const roles_guard_1 = __webpack_require__(13);
const roles_decorator_1 = __webpack_require__(14);
const role_enum_1 = __webpack_require__(15);
const create_report_dto_1 = __webpack_require__(19);
const update_report_dto_1 = __webpack_require__(20);
const authorized_request_interface_1 = __webpack_require__(7);
const report_interface_1 = __webpack_require__(21);
let ReportController = class ReportController {
    constructor(reportServiceClient) {
        this.reportServiceClient = reportServiceClient;
    }
    async createReport(reportRequest, request) {
        reportRequest.by_user_id = request.user.id;
        const createVehiculeResponse = await this.reportServiceClient
            .send('report_create', reportRequest)
            .toPromise();
        if (createVehiculeResponse.status !== common_1.HttpStatus.CREATED) {
            throw new common_1.HttpException({
                message: createVehiculeResponse.message,
                data: null,
                errors: createVehiculeResponse.errors,
            }, createVehiculeResponse.status);
        }
        return {
            message: createVehiculeResponse.message,
            data: {
                report: createVehiculeResponse.report,
            },
            errors: null,
        };
    }
    async getReportById(report) {
        const ReportResponse = await this.reportServiceClient
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
    async getAllReports() {
        const ReportResponse = await this.reportServiceClient
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
    async updateUserById(report_id, report_update) {
        let reportInfo = {};
        reportInfo.report_update = report_update;
        reportInfo.id = report_id;
        const ReportResponse = await this.reportServiceClient
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
};
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.User, role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Post('report'),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_report_dto_1.CreateReportDto !== "undefined" && create_report_dto_1.CreateReportDto) === "function" ? _a : Object, typeof (_b = typeof authorized_request_interface_1.IAuthorizedRequest !== "undefined" && authorized_request_interface_1.IAuthorizedRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ReportController.prototype, "createReport", null);
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Get('report/:id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof report_interface_1.IReport !== "undefined" && report_interface_1.IReport) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ReportController.prototype, "getReportById", null);
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ReportController.prototype, "getAllReports", null);
__decorate([
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Put('report/:id'),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof update_report_dto_1.UpdateReportDto !== "undefined" && update_report_dto_1.UpdateReportDto) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ReportController.prototype, "updateUserById", null);
ReportController = __decorate([
    common_1.Controller('reports'),
    __param(0, common_1.Inject('REPORT_SERVICE')),
    __metadata("design:paramtypes", [typeof (_j = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _j : Object])
], ReportController);
exports.ReportController = ReportController;


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateReportDto = void 0;
class CreateReportDto {
}
exports.CreateReportDto = CreateReportDto;


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateReportDto = void 0;
class UpdateReportDto {
}
exports.UpdateReportDto = UpdateReportDto;


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 22 */
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageController = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(5);
const platform_express_1 = __webpack_require__(23);
const roles_decorator_1 = __webpack_require__(14);
const role_enum_1 = __webpack_require__(15);
const auth_guard_1 = __webpack_require__(12);
const roles_guard_1 = __webpack_require__(13);
const authorized_request_interface_1 = __webpack_require__(7);
const upload_image_dto_1 = __webpack_require__(24);
const image_interface_1 = __webpack_require__(25);
let ImageController = class ImageController {
    constructor(imageServiceClient) {
        this.imageServiceClient = imageServiceClient;
    }
    async uploadImage(imageRequest, files, request) {
        imageRequest.user_id = request.user.id;
        const images = {
            file: files,
            image: imageRequest
        };
        console.log(images);
        const uploadImageResponse = await this.imageServiceClient
            .send('image_upload', images)
            .toPromise();
        if (uploadImageResponse.status !== common_1.HttpStatus.CREATED) {
            throw new common_1.HttpException({
                message: uploadImageResponse.message,
                data: null,
                errors: uploadImageResponse.errors,
            }, uploadImageResponse.status);
        }
        return {
            message: uploadImageResponse.message,
            data: {
                images: uploadImageResponse.images,
            },
            errors: null,
        };
    }
    async getImagesByUserId(image) {
        const imageInfo = image;
        const ImageResponse = await this.imageServiceClient
            .send('images_get_by_user_id', image.user_id)
            .toPromise();
        return {
            message: ImageResponse.message,
            data: {
                images: ImageResponse.images,
            },
            errors: null,
        };
    }
    async getImagesByUsersIds(users) {
        console.log(users);
        const ImageResponse = await this.imageServiceClient
            .send('images_get_by_users_ids', users.usersIds)
            .toPromise();
        return {
            message: ImageResponse.message,
            data: {
                images: ImageResponse.images,
            },
            errors: null,
        };
    }
    async deleteTask(image, request) {
        const imageData = {
            user_id: request.user.id,
            image_id: image.id
        };
        const deleteImageResponse = await this.imageServiceClient
            .send('image_delete', imageData)
            .toPromise();
        if (deleteImageResponse.status !== common_1.HttpStatus.OK) {
            throw new common_1.HttpException({
                message: deleteImageResponse.message,
                errors: deleteImageResponse.errors,
                data: null,
            }, deleteImageResponse.status);
        }
        return {
            message: deleteImageResponse.message,
            data: null,
            errors: null,
        };
    }
};
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.User, role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Post('image/upload'),
    common_1.UseInterceptors(platform_express_1.FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 }
    ])),
    __param(0, common_1.Query()), __param(1, common_1.UploadedFiles()), __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof upload_image_dto_1.UploadImageDto !== "undefined" && upload_image_dto_1.UploadImageDto) === "function" ? _a : Object, Object, typeof (_b = typeof authorized_request_interface_1.IAuthorizedRequest !== "undefined" && authorized_request_interface_1.IAuthorizedRequest) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ImageController.prototype, "uploadImage", null);
__decorate([
    common_1.Get('image/:user_id'),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof image_interface_1.IImage !== "undefined" && image_interface_1.IImage) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ImageController.prototype, "getImagesByUserId", null);
__decorate([
    common_1.Post('images'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ImageController.prototype, "getImagesByUsersIds", null);
__decorate([
    roles_decorator_1.hasRoles(role_enum_1.Role.User, role_enum_1.Role.Admin),
    common_1.UseGuards(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    common_1.Delete('image/:id'),
    __param(0, common_1.Param()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof image_interface_1.IImage !== "undefined" && image_interface_1.IImage) === "function" ? _g : Object, typeof (_h = typeof authorized_request_interface_1.IAuthorizedRequest !== "undefined" && authorized_request_interface_1.IAuthorizedRequest) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], ImageController.prototype, "deleteTask", null);
ImageController = __decorate([
    common_1.Controller('images'),
    __param(0, common_1.Inject('IMAGE_SERVICE')),
    __metadata("design:paramtypes", [typeof (_k = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _k : Object])
], ImageController);
exports.ImageController = ImageController;


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");;

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadImageDto = void 0;
class UploadImageDto {
}
exports.UploadImageDto = UploadImageDto;


/***/ }),
/* 25 */
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