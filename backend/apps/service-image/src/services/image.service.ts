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

    public async createImages(/*imageOrImages: IImage[]*/imageParams: { image: IImage, file: { avatar: any, background: any } }): Promise<IImage[]> {
        //const imageModel = new this.imageModel(imageOrImages);
        //return await imageModel.save();

        // const imageModel = await this.imageModel.insertMany(imageOrImages)

        // imageModel.forEach(function (v) { delete v.imagekit_file_id })

        // return imageModel
        
        let files = []

        if (imageParams.file.background) {
            const imageWithSameTypeAndSameUserExist = await this.searchImageByTypeAndUserId({ type: 'background', user_id: imageParams.image.user_id })

            console.log(imageWithSameTypeAndSameUserExist)

            if (imageWithSameTypeAndSameUserExist && imageWithSameTypeAndSameUserExist.length > 0) {
                //Update background image
                await this.deleteImageById(imageWithSameTypeAndSameUserExist[0].id, imageWithSameTypeAndSameUserExist[0].imagekit_file_id);
            }

            const imageBuffer = imageParams.file.background[0].buffer
    
            const imageBase64 = Buffer.from(imageBuffer).toString('base64')
  
            const imageName = imageParams.file.background[0].originalname

            let file: any = {}
            
            file = await this.uploadSingleImage(imageName, imageBase64)

            file.type = 'background'
  
            files.push(file)
        }

        if (imageParams.file.avatar) {
            const imageWithSameTypeAndSameUserExist = await this.searchImageByTypeAndUserId({ type: 'avatar', user_id: imageParams.image.user_id })

            console.log(imageWithSameTypeAndSameUserExist)

            if (imageWithSameTypeAndSameUserExist && imageWithSameTypeAndSameUserExist.length > 0) {
                //Update background image
                await this.deleteImageById(imageWithSameTypeAndSameUserExist[0].id, imageWithSameTypeAndSameUserExist[0].imagekit_file_id);
            }

            const imageBuffer = imageParams.file.avatar[0].buffer
    
            const imageBase64 = Buffer.from(imageBuffer).toString('base64')
  
            const imageName = imageParams.file.avatar[0].originalname
  
            let file: any = {}
            
            file = await this.uploadSingleImage(imageName, imageBase64)

            file.type = 'avatar'
  
            files.push(file)
        }

        let images: any = []

        if (files.length > 0) {
          files.forEach(file => {
            images.push(
              {
                link: file.url,
                imagekit_file_id: file.fileId,
                type: file.type,
                user_id: imageParams.image.user_id
              }
            )
          })
        }

        const imgs: IImage[] = images

        const imageModel = await this.imageModel.insertMany(imgs)

        imageModel.forEach(function (v) { delete v.imagekit_file_id })

        return imageModel
    }

    //Example a user cannot insert another avatar without removing the previous avatar
    public async searchImageByTypeAndUserId(params: { type: string, user_id: string }): Promise<IImage[]> {
        return this.imageModel.find(params).exec();
    }

    public async searchImagesByUserId(user_id: string): Promise<IImage[]> {
        const imageModel = await this.imageModel.find({ user_id: user_id })/*.where('user_id').equals(user_id)*/.select('-imagekit_file_id').exec();

        console.log(imageModel)

        return imageModel
    }

    public async searchImagesRemovalByUserId(user_id: string): Promise<IImage[]> {
        const imageModel = await this.imageModel.find({ user_id: user_id }).exec();

        console.log(imageModel)

        return imageModel
    }

    public async searchImagesByUsersIds(users_ids: Array<string>): Promise<IImage[]> {
        console.log(users_ids)

        const ids = ['6008595eee009f4c985b2b1d']//users_ids

        console.log(ids)
        
        //This works, but if doesn't find many in the database it returns empty array, others even if doesn't find some and finds many it returns an array of objects
        const imageModel = await this.imageModel.find({ user_id: { $in: users_ids } })/*.where(user_id).in(users_ids)*/.select('-imagekit_file_id').exec();

        console.log(imageModel)

        return imageModel
    }

    public async searchImageById(image_id: string): Promise<IImage> {
        return this.imageModel.findById(image_id).exec();
    }

    public async deleteImageById(image_id: string, imagekit_file_id: string): Promise<IImage> {
        await this.imageKit.deleteFile(imagekit_file_id).catch(err => {
            console.log(`The file you're requesting its deletion was already deleted or it doesn't exist`)

            console.log(err)
        })

        return this.imageModel.findOneAndDelete/*.deleteOne*/({ _id: image_id }).exec();
    }

    public async deleteAllProfileImages(images: IImage[]): Promise<any> {
        let deletedFiles: number = 0

        images.forEach(async image => {
            await this.deleteImageById(image.id, image.imagekit_file_id)

            deletedFiles++
        })

        return deletedFiles
    }

    public async uploadSingleImage(fileName: string, image: string): Promise<string> {
        let link = null

        try {
            const res = await this.imageKit.upload({
                file: image,
                fileName: fileName,
                folder: 'TheSocialNetwork'
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
                    fileName: fileName[i],
                    folder: 'TheSocialNetwork'
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
