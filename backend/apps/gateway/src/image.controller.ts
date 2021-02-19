import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { hasRoles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { IAuthorizedRequest } from './interfaces/common/authorized-request.interface';
import { DeleteImageResponseDto } from './interfaces/image/dto/delete-image-response.dto';
import { GetImagesByUserIdResponseDto } from './interfaces/image/dto/get-image-by-use-id.dto';
import { UploadImageResponseDto } from './interfaces/image/dto/upload-image-response.dto';
import { UploadImageDto } from './interfaces/image/dto/upload-image.dto';
import { IImage } from './interfaces/image/image.interface';
import { IServiceImageDeleteResponse } from './interfaces/image/service-image-delete-response.interface';
import { IServiceImagesGetByUserOrVehiculeIdResponse } from './interfaces/image/service-image-get-by-user-or-vehicule-id-response.interface';
import { IServiceImageUploadResponse } from './interfaces/image/service-image-upload-response.interface';

@Controller('images')
export class ImageController {
    constructor(@Inject('IMAGE_SERVICE') private readonly imageServiceClient: ClientProxy) { }

    //Upload avatar, background images
    @hasRoles(Role.User, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('image/upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 }
    ]))
    public async uploadImage(@Query() imageRequest: UploadImageDto, @UploadedFiles() files, @Req() request: IAuthorizedRequest): Promise<UploadImageResponseDto> {
        imageRequest.user_id = request.user.id

        const images = {
            file: files,
            image: imageRequest
        }

        console.log(images)

        const uploadImageResponse: IServiceImageUploadResponse = await this.imageServiceClient
            .send('image_upload', images)
            .toPromise();
        if (uploadImageResponse.status !== HttpStatus.CREATED) {
            throw new HttpException(
                {
                    message: uploadImageResponse.message,
                    data: null,
                    errors: uploadImageResponse.errors,
                },
                uploadImageResponse.status,
            );
        }

        return {
            message: uploadImageResponse.message,
            data: {
                images: uploadImageResponse.images,
            },
            errors: null,
        };
    }

    //Images by user id
    @Get('image/:user_id')
    public async getImagesByUserId(@Param() image: IImage): Promise<GetImagesByUserIdResponseDto> {
        //console.log(request)
        const imageInfo = image;

        //Improve this by returning data based on user's role as Livreur, client(meaning normal user), entreprise, moderator and admin
        const ImageResponse: IServiceImagesGetByUserOrVehiculeIdResponse = await this.imageServiceClient
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

    //Delete image by id
    @hasRoles(Role.User, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Delete('image/:id')
    //@Authorization(true)
    //@Permission('task_delete_by_id')
    public async deleteTask(@Param() image: IImage, @Req() request: IAuthorizedRequest): Promise<DeleteImageResponseDto> {
        const imageData: any = {
            user_id: request.user.id,
            image_id: image.id
        }

        const deleteImageResponse: IServiceImageDeleteResponse = await this.imageServiceClient
            .send('image_delete', imageData)
            .toPromise();

        if (deleteImageResponse.status !== HttpStatus.OK) {
            throw new HttpException(
                {
                    message: deleteImageResponse.message,
                    errors: deleteImageResponse.errors,
                    data: null,
                },
                deleteImageResponse.status,
            );
        }

        return {
            message: deleteImageResponse.message,
            data: null,
            errors: null,
        };
    }

    //Images by users ids
    @Post('images')
    public async getImagesByUsersIds(@Body() users: { usersIds: string[] }): Promise<GetImagesByUserIdResponseDto> {
        console.log(users)
        //const imageInfo = image;

        //Improve this by returning data based on user's role as Livreur, client(meaning normal user), entreprise, moderator and admin
        const ImageResponse: IServiceImagesGetByUserOrVehiculeIdResponse = await this.imageServiceClient
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
}