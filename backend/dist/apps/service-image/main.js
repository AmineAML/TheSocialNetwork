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
const service_image_module_1 = __webpack_require__(5);
const logger = new common_1.Logger('Image');
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(service_image_module_1.ServiceImageModule, {
        transport: microservices_1.Transport.REDIS,
        options: {
            url: new config_1.ConfigService().get('NODE_ENV') === 'production' ? new config_1.ConfigService().get('REDIS_PROD') : new config_1.ConfigService().get('REDIS_ACCOUNT_SERVICE_URL')
        }
    });
    await app.listen(() => logger.log('Microservice image is listening'));
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
exports.ServiceImageModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(6);
const image_schema_1 = __webpack_require__(7);
const service_image_controller_1 = __webpack_require__(9);
const image_service_1 = __webpack_require__(10);
let ServiceImageModule = class ServiceImageModule {
};
ServiceImageModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('NODE_ENV') === 'production' ? configService.get('MONGO_IMAGE_PROD') : `mongodb://${configService.get('MONGO_IMAGE_USERNAME')}:${encodeURIComponent(configService.get('MONGO_IMAGE_PASSWORD'))}@${configService.get('MONGO_IMAGE_HOST')}:${configService.get('MONGO_IMAGE_PORT')}/${configService.get('MONGO_IMAGE_DATABASE')}`,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }),
                inject: [config_1.ConfigService],
            }),
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Image',
                    schema: image_schema_1.ImageSchema,
                    collection: 'images',
                }
            ]),
        ],
        controllers: [service_image_controller_1.ServiceImageController],
        providers: [image_service_1.ImageService],
    })
], ServiceImageModule);
exports.ServiceImageModule = ServiceImageModule;


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");;

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageSchema = void 0;
const mongoose = __webpack_require__(8);
function transformValue(doc, ret) {
    delete ret._id;
}
exports.ImageSchema = new mongoose.Schema({
    link: {
        type: String,
        required: [true, 'Link can not be empty']
    },
    type: {
        type: String,
        required: [true, 'Type can not be empty'],
        enum: ['avatar', 'background']
    },
    user_id: {
        type: String,
        required: [true, 'User id can not be empty']
    },
    imagekit_file_id: {
        type: String,
        required: [true, 'Imagekit file id can not be empty']
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
exports.ServiceImageController = void 0;
const common_1 = __webpack_require__(1);
const microservices_1 = __webpack_require__(4);
const image_service_1 = __webpack_require__(10);
let ServiceImageController = class ServiceImageController {
    constructor(imageService) {
        this.imageService = imageService;
    }
    async uploadImage(imageParams) {
        let result;
        if (imageParams) {
            console.log(imageParams);
            try {
                const uploadedImages = await this.imageService.createImages(imageParams);
                result = {
                    status: common_1.HttpStatus.CREATED,
                    message: 'image_upload_success',
                    images: uploadedImages,
                    errors: null,
                };
                console.log(uploadedImages);
            }
            catch (e) {
                result = {
                    status: common_1.HttpStatus.PRECONDITION_FAILED,
                    message: 'image_upload_precondition_failed',
                    images: null,
                    errors: e.errors,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'image_upload_bad_request',
                images: null,
                errors: null,
            };
        }
        return result;
    }
    async getImagesByuserId(user_id) {
        let result;
        if (user_id) {
            const images = await this.imageService.searchImagesByUserId(user_id);
            if (images && images.length > 0) {
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'image_get_by_user_id_success',
                    images,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'image_get_by_user_id_not_found',
                    images: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'image_get_by_user_id_bad_request',
                images: null,
            };
        }
        return result;
    }
    async getImagesByusersIds(users_ids) {
        let result;
        if (users_ids) {
            const images = await this.imageService.searchImagesByUsersIds(users_ids);
            if (images && images.length > 0) {
                result = {
                    status: common_1.HttpStatus.OK,
                    message: 'images_get_by_users_ids_success',
                    images,
                };
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'images_get_by_users_ids_not_found',
                    images: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'images_get_by_users_ids_bad_request',
                images: null,
            };
        }
        return result;
    }
    async deleteModify(imageData) {
        let result;
        const { user_id, image_id } = imageData;
        if (image_id) {
            const image = await this.imageService.searchImageById(image_id);
            if (image) {
                if (!(user_id == image.user_id)) {
                    result = {
                        status: common_1.HttpStatus.UNAUTHORIZED,
                        message: 'image_delete_unauthorized',
                        errors: null,
                    };
                }
                else {
                    const imageId = image.id;
                    const imagekit_file_Id = image.imagekit_file_id;
                    await this.imageService.deleteImageById(imageId, imagekit_file_Id);
                    result = {
                        status: common_1.HttpStatus.OK,
                        message: 'image_delete_success',
                        errors: null,
                    };
                }
            }
            else {
                result = {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'image_not_found',
                    errors: null,
                };
            }
        }
        else {
            result = {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'image_bad_request',
                errors: null,
            };
        }
        return result;
    }
};
__decorate([
    microservices_1.MessagePattern('image_upload'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
], ServiceImageController.prototype, "uploadImage", null);
__decorate([
    microservices_1.MessagePattern('images_get_by_user_id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], ServiceImageController.prototype, "getImagesByuserId", null);
__decorate([
    microservices_1.MessagePattern('images_get_by_users_ids'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Array !== "undefined" && Array) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ServiceImageController.prototype, "getImagesByusersIds", null);
__decorate([
    microservices_1.MessagePattern('image_delete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ServiceImageController.prototype, "deleteModify", null);
ServiceImageController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [typeof (_f = typeof image_service_1.ImageService !== "undefined" && image_service_1.ImageService) === "function" ? _f : Object])
], ServiceImageController);
exports.ServiceImageController = ServiceImageController;


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageService = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(6);
const mongoose_2 = __webpack_require__(8);
const ImageKit = __webpack_require__(11);
let ImageService = class ImageService {
    constructor(imageModel, configService) {
        this.imageModel = imageModel;
        this.configService = configService;
        this.imageKit = new ImageKit({
            publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
            privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
            urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT')
        });
    }
    async createImages(imageParams) {
        let files = [];
        if (imageParams.file.background) {
            const imageWithSameTypeAndSameUserExist = await this.searchImageByTypeAndUserId({ type: 'background', user_id: imageParams.image.user_id });
            console.log(imageWithSameTypeAndSameUserExist);
            if (imageWithSameTypeAndSameUserExist && imageWithSameTypeAndSameUserExist.length > 0) {
                await this.deleteImageById(imageWithSameTypeAndSameUserExist[0].id, imageWithSameTypeAndSameUserExist[0].imagekit_file_id);
            }
            const imageBuffer = imageParams.file.background[0].buffer;
            const imageBase64 = Buffer.from(imageBuffer).toString('base64');
            const imageName = imageParams.file.background[0].originalname;
            let file = {};
            file = await this.uploadSingleImage(imageName, imageBase64);
            file.type = 'background';
            files.push(file);
        }
        if (imageParams.file.avatar) {
            const imageWithSameTypeAndSameUserExist = await this.searchImageByTypeAndUserId({ type: 'avatar', user_id: imageParams.image.user_id });
            console.log(imageWithSameTypeAndSameUserExist);
            if (imageWithSameTypeAndSameUserExist && imageWithSameTypeAndSameUserExist.length > 0) {
                await this.deleteImageById(imageWithSameTypeAndSameUserExist[0].id, imageWithSameTypeAndSameUserExist[0].imagekit_file_id);
            }
            const imageBuffer = imageParams.file.avatar[0].buffer;
            const imageBase64 = Buffer.from(imageBuffer).toString('base64');
            const imageName = imageParams.file.avatar[0].originalname;
            let file = {};
            file = await this.uploadSingleImage(imageName, imageBase64);
            file.type = 'avatar';
            files.push(file);
        }
        let images = [];
        if (files.length > 0) {
            files.forEach(file => {
                images.push({
                    link: file.url,
                    imagekit_file_id: file.fileId,
                    type: file.type,
                    user_id: imageParams.image.user_id
                });
            });
        }
        const imgs = images;
        const imageModel = await this.imageModel.insertMany(imgs);
        imageModel.forEach(function (v) { delete v.imagekit_file_id; });
        return imageModel;
    }
    async searchImageByTypeAndUserId(params) {
        return this.imageModel.find(params).exec();
    }
    async searchImagesByUserId(user_id) {
        const imageModel = await this.imageModel.find({ user_id: user_id }).select('-imagekit_file_id').exec();
        console.log(imageModel);
        return imageModel;
    }
    async searchImagesByUsersIds(users_ids) {
        console.log(users_ids);
        const ids = ['6008595eee009f4c985b2b1d'];
        console.log(ids);
        const imageModel = await this.imageModel.find({ user_id: { $in: users_ids } }).select('-imagekit_file_id').exec();
        console.log(imageModel);
        return imageModel;
    }
    async searchImageById(image_id) {
        return this.imageModel.findById(image_id).exec();
    }
    async deleteImageById(image_id, imagekit_file_id) {
        await this.imageKit.deleteFile(imagekit_file_id);
        return this.imageModel.findOneAndDelete({ _id: image_id }).exec();
    }
    async uploadSingleImage(fileName, image) {
        let link = null;
        try {
            const res = await this.imageKit.upload({
                file: image,
                fileName: fileName
            });
            link = {
                url: res.url,
                fileId: res.fileId
            };
        }
        catch (e) {
            link = null;
            console.log(e);
        }
        return link;
    }
    async uploadMultipleImages(fileName, image) {
        let links = [];
        const total = image.length;
        for (let i = 0; i < total; i++) {
            try {
                const res = await this.imageKit.upload({
                    file: image[i],
                    fileName: fileName[i]
                });
                links.push({
                    url: res.url,
                    fileId: res.fileId
                });
            }
            catch (e) {
                links = null;
                console.log(e);
            }
        }
        return links;
    }
};
ImageService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('Image')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], ImageService);
exports.ImageService = ImageService;


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("imagekit");;

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