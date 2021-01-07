import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IImage } from '../interfaces/image.interface';

const ImageKit = require('imagekit')

@Injectable()
export class ImageService {
    imageKit: ImageKit

    constructor(
        @InjectModel('Image') private readonly imageModel: Model<IImage>,
        private configService: ConfigService
    ) {
        this.imageKit = new ImageKit({
            publicKey: this.configService.get<string>('IMAGEKIT_PUBLIC_KEY'),
            privateKey: this.configService.get<string>('IMAGEKIT_PRIVATE_KEY'),
            urlEndpoint: this.configService.get<string>('IMAGEKIT_URL_ENDPOINT')
        })
    }

    public async createImage(imageOrImages: IImage[]): Promise<IImage[]> {
        //const imageModel = new this.imageModel(imageOrImages);
        //return await imageModel.save();
        const imageModel = await this.imageModel.insertMany(imageOrImages)

        imageModel.forEach(function (v) { delete v.imagekit_file_id })

        return imageModel
    }

    public async searchImagesByUserOrVehiculeId(user_id: string): Promise<IImage | IImage[]> {
        const imageModel = await this.imageModel.find().where('user_id').equals(user_id).exec();

        imageModel.forEach(function (v) { delete v.imagekit_file_id })

        return imageModel
    }

    public async searchImageById(image_id: string): Promise<IImage> {
        return this.imageModel.findById({ image_id }).exec();
    }

    public async deleteImageById(image_id: string, imagekit_file_id: string): Promise<IImage> {
        await this.imageKit.deleteFile(imagekit_file_id)

        return this.imageModel.findOneAndDelete/*.deleteOne*/({ _id: image_id }).exec();
    }

    public async uploadSingleImage(fileName: string, image: string): Promise<string> {
        let link = null

        try {
            const res = await this.imageKit.upload({
                file: image,
                fileName: fileName
            })

            link = {
                url: res.url,
                fileId: res.fileId
            }
        } catch (e) {
            link = null

            console.log(e)
        }

        return link
    }

    public async uploadMultipleImages(fileName: string[], image: string[]): Promise<string[]> {
        let links = []

        const total = image.length

        for (let i = 0; i < total; i++) {
            try {
                const res = await this.imageKit.upload({
                    file: image[i],
                    fileName: fileName[i]
                })

                links.push({
                    url: res.url,
                    fileId: res.fileId
                })
            } catch (e) {
                links = null

                console.log(e)
            }
        }

        return links
    }

    /*public async updateImageById(image_id: string, userParams: any ): Promise<IImage> {
        return this.imageModel.updateOne({ _id: image_id }, userParams).exec();
    }
    */
}
