import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IImageConfirmResponse } from './interfaces/image-confirm-response.interface';
import { IImageCreateResponse } from './interfaces/image-create-response.interface';
import { IImageSearchResponse } from './interfaces/image-search-response.interface';
import { IImage } from './interfaces/image.interface';
import { ImageService } from './services/image.service';

@Controller()
export class ServiceImageController {
  constructor(private readonly imageService: ImageService) { }

  //Upload a new profile avatar or background image or a new vehicule images
  @MessagePattern('image_upload')
  public async uploadImage(ImageParams: { image: IImage, file: { avatar: any, background: any } }): Promise<IImageCreateResponse> {
    let result: IImageCreateResponse;

    console.log(ImageParams)

    let files = []

    if (ImageParams.file.avatar || ImageParams.file.background) {
      const imageBuffer = ImageParams.file.avatar[0].buffer || ImageParams.file.background[0].buffer

      const imageBase64 = Buffer.from(imageBuffer).toString('base64')

      const imageName = ImageParams.file.avatar[0].originalname || ImageParams.file.background[0].originalname

      files.push(await this.imageService.uploadSingleImage(imageName, imageBase64))

      console.log(files)
    }

    let images: any = []

    if (files.length > 0) {
      files.forEach(file => {
        images.push(
          {
            link: file.url,
            imagekit_file_id: file.fileId,
            type: ImageParams.image.type,
            user_id: ImageParams.image.user_id
          }
        )
      })
    }

    console.log(images)

    if (ImageParams) {
      try {
        const createdImage: any = await this.imageService.createImage(images);
        result = {
          status: HttpStatus.CREATED,
          message: 'image_upload_success',
          images: createdImage,
          errors: null,
        };

        console.log(createdImage)
      } catch (e) {
        result = {
          status: HttpStatus.PRECONDITION_FAILED,
          message: 'image_upload_precondition_failed',
          images: null,
          errors: e.errors,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'image_upload_bad_request',
        images: null,
        errors: null,
      };
    }

    return result;
  }

  //Get imageS by user id
  @MessagePattern('image_get_by_user_id')
  public async getImageByuderId(user_id: string): Promise<IImageSearchResponse> {
    let result: IImageSearchResponse;

    if (user_id) {
      const image = await this.imageService.searchImagesByUserOrVehiculeId(user_id);
      if (image) {
        result = {
          status: HttpStatus.OK,
          message: 'image_get_by_user_id_success',
          image,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'image_get_by_user_id_not_found',
          image: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'image_get_by_user_id_bad_request',
        image: null,
      };
    }

    return result;
  }

  //Delete avatar or background profile image, also useful with modifying an image meaning you don't modify an image's rather you delete it and insert a new image
  @MessagePattern('image_delete')
  public async modifyModify(image_id: string): Promise<IImageConfirmResponse> {
    let result: IImageConfirmResponse;

    if (image_id) {
      const image = await this.imageService.searchImageById(image_id);

      if (image && image[0]) {
        const imageId = image.id;
        const imagekit_file_Id = image.imagekit_file_id;
        await this.imageService.deleteImageById(imageId, imagekit_file_Id);
        result = {
          status: HttpStatus.OK,
          message: 'image_delete_success',
          errors: null,
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'image_not_found',
          errors: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'image_bad_request',
        errors: null,
      };
    }

    return result;
  }
}
