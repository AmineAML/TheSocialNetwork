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
const service_account_module_1 = __webpack_require__(5);
const logger = new common_1.Logger('Account');
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(service_account_module_1.ServiceAccountModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            url: new config_1.ConfigService().get('NODE_ENV') === 'production' ? new config_1.ConfigService().get('REDIS_PROD') : new config_1.ConfigService().get('REDIS_ACCOUNT_SERVICE_URL')
        }
    });
    await app.listen(() => logger.log('Microservice account is listening'));
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
exports.ServiceAccountModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(6);
const interest_schema_1 = __webpack_require__(7);
const user_link_schema_1 = __webpack_require__(9);
const user_schema_1 = __webpack_require__(10);
const service_account_controller_1 = __webpack_require__(12);
const user_service_1 = __webpack_require__(14);
let ServiceAccountModule = class ServiceAccountModule {
};
ServiceAccountModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('NODE_ENV') === 'production' ? configService.get('MONGO_ACCOUNT_PROD') : `mongodb://${configService.get('MONGO_ACCOUNT_USERNAME')}:${encodeURIComponent(configService.get('MONGO_ACCOUNT_PASSWORD'))}@${configService.get('MONGO_ACCOUNT_HOST')}:${configService.get('MONGO_ACCOUNT_PORT')}/${configService.get('MONGO_ACCOUNT_DATABASE')}`,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'User',
                    schema: user_schema_1.UserSchema,
                    collection: 'users',
                },
                {
                    name: 'UserLink',
                    schema: user_link_schema_1.UserLinkSchema,
                    collection: 'user_links',
                },
                {
                    name: 'Interest',
                    schema: interest_schema_1.InterestSchema,
                    collection: 'interests',
                },
            ])
        ],
        controllers: [service_account_controller_1.ServiceAccountController],
        providers: [
            user_service_1.UserService,
            {
                provide: 'MAILER_SERVICE',
                useFactory: (configService) => {
                    const mailerServiceOptions = {
                        options: {
                            url: configService.get('NODE_ENV') === 'production' ? configService.get('REDIS_PROD') : configService.get('REDIS_ACCOUNT_SERVICE_URL')
                        },
                        transport: microservices_1.Transport.REDIS
                    };
                    console.log(mailerServiceOptions);
                    return microservices_1.ClientProxyFactory.create(mailerServiceOptions);
                },
                inject: [config_1.ConfigService]
            },
        ],
    })
], ServiceAccountModule);
exports.ServiceAccountModule = ServiceAccountModule;


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");;

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InterestSchema = void 0;
const mongoose = __webpack_require__(8);
function transformValue(doc, ret) {
    delete ret._id;
}
exports.InterestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name can not be empty'],
    },
    byNumberOfUsers: {
        type: Number,
        required: [true, 'By number of users can not be empty'],
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserLinkSchema = void 0;
const mongoose = __webpack_require__(8);
function transformValue(doc, ret) {
    delete ret._id;
}
function generateLink() {
    return Math.random().toString(36).replace('0.', '');
}
exports.UserLinkSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, 'User can not be empty'],
    },
    is_used: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
        default: generateLink(),
    },
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
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = void 0;
const mongoose = __webpack_require__(8);
const bcrypt = __webpack_require__(11);
const SALT_ROUNDS = 12;
function transformValue(doc, ret) {
    delete ret._id;
    delete ret.password;
}
exports.UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email can not be empty'],
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Email should be valid',
        ],
    },
    is_confirmed: {
        type: Boolean,
        required: [true, 'Confirmed can not be empty'],
    },
    password: {
        type: String,
        required: [true, 'Password can not be empty'],
        minlength: [3, 'Password should include at least 6 chars'],
        maxlength: [72, 'Password should not include more than 72 chars']
    },
    username: {
        type: String,
        required: [true, 'Username can not be empty'],
        trim: true
    },
    first_name: {
        type: String,
        required: [false, ''],
        trim: true
    },
    last_name: {
        type: String,
        required: [false, ''],
        trim: true
    },
    description: {
        type: String,
        required: [false, ''],
        maxlength: [1000, 'Description should not include more than 1000 chars'],
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [false, ''],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: [true, 'Role can not be empty']
    },
    social_media: {
        type: {
            facebook: String,
            linkedin: String,
            twitter: String,
            tiktok: String,
            discord: String,
            instagram: String,
            youtube: String
        },
        required: [false],
    },
    interest: {
        type: Array,
        required: [false]
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
exports.UserSchema.methods.getEncryptedPassword = (password) => {
    return bcrypt.hash(String(password), SALT_ROUNDS);
};
exports.UserSchema.methods.compareEncryptedPassword = function (password) {
    return bcrypt.compare(password, this.password);
};
exports.UserSchema.pre('save', async function (next) {
    const self = this;
    if (!this.isModified('password')) {
        return next();
    }
    self.password = await self.getEncryptedPassword(self.password);
    next();
});


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("bcrypt");;

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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceAccountController = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(4);
const user_interface_1 = __webpack_require__(13);
const user_service_1 = __webpack_require__(14);
let ServiceAccountController = class ServiceAccountController {
    constructor(userService, mailerServiceClient) {
        this.userService = userService;
        this.mailerServiceClient = mailerServiceClient;
    }
    async createUser(userParams) {
        let result;
        if (userParams) {
            const usersWithEmail = await this.userService.searchUserByEmail({
                email: userParams.email,
            });
            if (usersWithEmail && usersWithEmail.length > 0) {
                result = {
                    status: common_1.HttpStatus.CONFLICT,
                    message: 'user_create_conflict',
                    user: null,
                    errors: {
                        email: {
                            message: 'Email already exists',
                            path: 'email',
                        },
                    },
                };
            }
            else {
                const usersWithUsername = await this.userService.searchUserByUserName({
                    username: userParams.username
                });
                if (usersWithUsername && usersWithUsername.length > 0) {
                    result = {
                        status: common_1.HttpStatus.CONFLICT,
                        message: 'user_create_conflict',
                        user: null,
                        errors: {
                            email: {
                                message: 'Username already exists',
                                path: 'username',
                            },
                        },
                    };
                }
                else {
                    try {
                        userParams.is_confirmed = false;
                        const createdUser = await this.userService.createUser(userParams);
                        const userLink = await this.userService.createUserLink(createdUser.id);
                        delete createdUser.password;
                        result = {
                            status: common_1.HttpStatus.CREATED,
                            message: 'user_create_success',
                            user: createdUser,
                            errors: null,
                        };
                        this.mailerServiceClient
                            .send('mail_send_confirm_email', {
                            to: createdUser.email,
                            from: this.userService.getAppEmail(),
                            subject: 'Email confirmation',
                            text: "and easy to do anywhere, even with Node.js",
                            html: `<center>
                <b>Hi there, please confirm your email to unlock the full features of The Social Network.</b><br>
                Use the following link for this.<br>
                <a href="${this.userService.getConfirmationLink(userLink.link)}"><b>Confirm The Email</b></a><br>
                If that doesn't work, paste this link into a new page: ${this.userService.getConfirmationLink(userLink.link)}
                </center>`,
                        })
                            .toPromise();
                    }
                    catch (e) {
                        console.log(e);
                        result = {
                            status: common_1.HttpStatus.PRECONDITION_FAILED,
                            message: 'user_create_precondition_failed',
                            user: null,
                            errors: e.errors,
                        };
                    }
                }
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'user_create_bad_request',
                user: null,
                errors: null,
            };
        }
        return result;
    }
    async getUserByUsername(username) {
        let result;
        if (username) {
            const user = await this.userService.searchUserByUsername(username);
            if (user) {
                delete user.password;
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'user_get_by_username_success',
                    user,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'user_get_by_username_not_found',
                    user: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'user_get_by_username_bad_request',
                user: null,
            };
        }
        return result;
    }
    async getUserById(id) {
        let result;
        if (id) {
            const user = await this.userService.searchUserById(id);
            if (user) {
                delete user.password;
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'user_get_by_id_success',
                    user,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'user_get_by_id_not_found',
                    user: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'user_get_by_id_bad_request',
                user: null,
            };
        }
        return result;
    }
    async searchUserByCredentials(searchParams) {
        let result;
        if (searchParams.email && searchParams.password) {
            const user = await this.userService.searchUserByEmail({
                email: searchParams.email,
            });
            if (user && user[0]) {
                if (await user[0].compareEncryptedPassword(searchParams.password)) {
                    result = {
                        status: common_1.HttpStatus.OK,
                        message: 'user_search_by_credentials_success',
                        user: user[0],
                    };
                }
                else {
                    result = {
                        status: common_1.HttpStatus.NOT_FOUND,
                        message: 'user_search_by_credentials_not_match',
                        user: null,
                    };
                }
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'user_search_by_credentials_not_found',
                    user: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'user_search_by_credentials_not_found',
                user: null,
            };
        }
        return result;
    }
    async modifyUser(modifyParams) {
        let result;
        if (modifyParams) {
            console.log(modifyParams);
            const user = await this.userService.searchUserById(modifyParams.user_id);
            console.log(user);
            if (user) {
                const userId = user.id;
                const userData = modifyParams.user_update;
                const user_updated = await this.userService.updateUserProfileById(userId, userData);
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'user_confirm_success',
                    user: user_updated,
                    errors: null,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'user_confirm_not_found',
                    user: null,
                    errors: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'user_confirm_bad_request',
                user: null,
                errors: null,
            };
        }
        return result;
    }
    async getUsersByCategory(params) {
        let result;
        const { match, page, limit, route } = params;
        if (match.search_term) {
            console.log('Any of is there');
            let queries = {};
            queries.interest = match.search_term;
            const usersResponse = await this.userService.searchUsers(queries, page, limit, route);
            console.log(usersResponse.users);
            if (usersResponse.users) {
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'users_get_by_id_query',
                    users: usersResponse.users,
                    meta: usersResponse.meta,
                    link: usersResponse.link
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'users_get_by_query_not_found',
                    users: null,
                    meta: usersResponse.meta,
                    link: usersResponse.link
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'users_get_by_query_bad_request',
                users: null,
                meta: null,
                link: null
            };
        }
        return result;
    }
    async confirmUser(confirmParams) {
        let result;
        if (confirmParams) {
            const userLink = await this.userService.getUserLink(confirmParams.link);
            if (userLink && userLink[0]) {
                const userId = userLink[0].user_id;
                const updatedUser = await this.userService.updateUserById(userId, {
                    is_confirmed: true,
                });
                await this.userService.updateUserLinkById(userLink[0].id, {
                    is_used: true,
                });
                this.mailerServiceClient
                    .send('mail_send_welcome_tutorial', {
                    to: updatedUser.email,
                    from: this.userService.getAppEmail(),
                    subject: `Welcome to ${this.userService.getAppName}`,
                    html: `<center>
          Dear ${updatedUser.first_name} ${updatedUser.last_name},
          <b>Thank you for joining ${this.userService.getAppName}, we are happy to have you!<br>
          With us you can make new friends, chat and add people to your network<br>
          ${this.userService.getAppName} team
          </center>`,
                })
                    .toPromise();
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'user_confirm_success',
                    errors: null,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'user_confirm_not_found',
                    errors: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'user_confirm_bad_request',
                errors: null,
            };
        }
        return result;
    }
    async getTopInterests() {
        let result;
        const interests = await this.userService.getAllInterestBySorting();
        if (interests) {
            result = {
                status: common_1.HttpStatus.OK,
                message: 'interest_get_all_success',
                interests,
            };
        }
        else {
            result = {
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'interest_get_all_not_found',
                interests: null,
            };
        }
        return result;
    }
};
__decorate([
    microservices_1.MessagePattern('user_create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof user_interface_1.IUser !== "undefined" && user_interface_1.IUser) === "function" ? _a : Object]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], ServiceAccountController.prototype, "createUser", null);
__decorate([
    microservices_1.MessagePattern('user_get_by_username'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ServiceAccountController.prototype, "getUserByUsername", null);
__decorate([
    microservices_1.MessagePattern('user_get_by_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ServiceAccountController.prototype, "getUserById", null);
__decorate([
    microservices_1.MessagePattern('user_search_by_credentials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ServiceAccountController.prototype, "searchUserByCredentials", null);
__decorate([
    microservices_1.MessagePattern('user_modify_profile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ServiceAccountController.prototype, "modifyUser", null);
__decorate([
    microservices_1.MessagePattern('users_search_by_query'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ServiceAccountController.prototype, "getUsersByCategory", null);
__decorate([
    microservices_1.MessagePattern('user_confirm'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ServiceAccountController.prototype, "confirmUser", null);
__decorate([
    microservices_1.MessagePattern('interest_get_all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], ServiceAccountController.prototype, "getTopInterests", null);
ServiceAccountController = __decorate([
    common_1.Controller(),
    __param(1, common_1.Inject('MAILER_SERVICE')),
    __metadata("design:paramtypes", [typeof (_k = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _k : Object, typeof (_l = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _l : Object])
], ServiceAccountController);
exports.ServiceAccountController = ServiceAccountController;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 14 */
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(8);
const config_1 = __webpack_require__(2);
let UserService = class UserService {
    constructor(userModel, userLinkModel, configService, interestModel) {
        this.userModel = userModel;
        this.userLinkModel = userLinkModel;
        this.configService = configService;
        this.interestModel = interestModel;
    }
    async createUser(user) {
        if (user.interest && user.interest.length > 0) {
            user.interest = user.interest.map(v => v.toLowerCase());
        }
        const userModel = await new this.userModel(user).save();
        delete userModel.password;
        await this.insertOrIncrementInterest(userModel);
        return userModel;
    }
    async searchUserByEmail(params) {
        return this.userModel.find(params).exec();
    }
    async searchUserByUserName(params) {
        return this.userModel.find(params).exec();
    }
    async searchUserById(id) {
        const userModel = await this.userModel.findById(id).exec();
        return userModel;
    }
    async searchUserByUsername(username) {
        const userModel = await this.userModel.findOne({ username: username }).exec();
        return userModel;
    }
    async updateUserProfileById(id, userParams) {
        delete userParams.password;
        delete userParams.email;
        const userModel = await this.userModel.updateOne({ _id: id }, userParams).exec();
        await this.insertOrIncrementInterest(userModel);
        return userModel;
    }
    async updateUserById(id, userParams) {
        return this.userModel.updateOne({ _id: id }, userParams).exec();
    }
    async searchUsers(queries, page, limit, route) {
        let q = {};
        queries.interest ? q.interest = { $exists: true, $ne: null, $in: queries.interest } : q;
        const users = await this.userModel.find(q).skip((limit * page) - limit).limit(limit).exec();
        const numberOfUsersInResult = await this.userModel.count(q);
        const meta = {
            itemCount: users.length,
            totalItems: numberOfUsersInResult,
            itemsPerPage: limit,
            totalPages: Math.ceil(numberOfUsersInResult / limit),
            currentPage: page
        };
        const link = {
            first: numberOfUsersInResult > 0 ? `${route}&limit=${limit}` : '',
            previous: numberOfUsersInResult > 0 ? (page === 1 ? '' : `${route}&page=${page - 1}&limit=${limit}`) : '',
            next: numberOfUsersInResult > 0 ? (page === Math.ceil(numberOfUsersInResult / limit) ? '' : `${route}&page=${page + 1}&limit=${limit}`) : '',
            last: numberOfUsersInResult > 0 ? (`${route}&page=${Math.ceil(numberOfUsersInResult / limit)}&limit=${limit}`) : ''
        };
        users ? users.forEach(function (v) { delete v.password; }) : users;
        return {
            users,
            meta,
            link
        };
    }
    async createUserLink(id) {
        const userLinkModel = new this.userLinkModel({
            user_id: id,
        });
        return await userLinkModel.save();
    }
    async getUserLink(link) {
        return this.userLinkModel.find({ link, is_used: false }).exec();
    }
    async updateUserLinkById(id, linkParams) {
        return this.userLinkModel.updateOne({ _id: id }, linkParams);
    }
    getConfirmationLink(link) {
        const emailConfirmationLink = `${this.configService.get('BASE_URL')}/users/confirm/${link}`;
        console.log(emailConfirmationLink);
        return emailConfirmationLink;
    }
    getAppEmail() {
        return `${this.configService.get('APP_EMAIL')}`;
    }
    getAppName() {
        return `${this.configService.get('APP_NAME')}`;
    }
    async getAllInterestBySorting() {
        return this.interestModel.find({}).sort({ byNumberOfUsers: 'desc' }).exec();
    }
    async insertOrIncrementInterest(userModel) {
        if (userModel.interest && userModel.interest.length > 0) {
            const { interest } = userModel;
            let query = [];
            interest.forEach(async (interest) => {
                await this.interestModel.findOneAndUpdate({ 'name': interest.toLowerCase() }, { $inc: { byNumberOfUsers: 1 } }, { new: true, upsert: true });
            });
            console.log('Improved hobbies');
        }
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __param(1, mongoose_1.InjectModel('UserLink')),
    __param(3, mongoose_1.InjectModel('Interest')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object])
], UserService);
exports.UserService = UserService;


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