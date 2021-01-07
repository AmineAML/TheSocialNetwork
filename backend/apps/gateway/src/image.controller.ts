import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { hasRoles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
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
    @hasRoles(Role.User)
    @UseGuards(AuthGuard, RolesGuard)
    @Post('image/upload')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 }
    ]))
    public async uploadImage(@Query() imageRequest: UploadImageDto, @UploadedFiles() files): Promise<UploadImageResponseDto> {
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
    public async getImagesByUserOrVehiculeId(@Param() image: IImage): Promise<GetImagesByUserIdResponseDto> {
        //console.log(request)
        const imageInfo = image;

        //Improve this by returning data based on user's role as Livreur, client(meaning normal user), entreprise, moderator and admin
        const ImageResponse: IServiceImagesGetByUserOrVehiculeIdResponse = await this.imageServiceClient
            .send('image_get_by_user_id', imageInfo.user_id)
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
    @Delete('image/:id')
    //@Authorization(true)
    //@Permission('task_delete_by_id')
    public async deleteTask(@Param() image: IImage ): Promise<DeleteImageResponseDto> {
        const userInfo = image;

        const deleteImageResponse: IServiceImageDeleteResponse = await this.imageServiceClient
            .send('image_delete', { imageId: userInfo.id })
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
}