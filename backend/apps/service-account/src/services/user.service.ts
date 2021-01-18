import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../interfaces/user.interface';
import { IUserLink } from '../interfaces/user-link.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
        @InjectModel('UserLink') private readonly userLinkModel: Model<IUserLink>,
        private readonly configService: ConfigService,
    ) { }

    public async createUser(user: IUser): Promise<IUser> {
        const userModel = await new this.userModel(user).save();

        delete userModel.password

        return userModel
    }

    public async searchUserByEmail(params: { email: string }): Promise<IUser[]> {
        return this.userModel.find(params).exec();
    }

    public async searchUserByUserName(params: { username: string }): Promise<IUser[]> {
        return this.userModel.find(params).exec();
    }

    public async searchUserById(id: string): Promise<IUser> {
        const userModel = await this.userModel.findById(id).exec();

        return userModel
    }

    public async searchUserByUsername(username: string): Promise<IUser> {
        const userModel = await this.userModel.findOne({ username: username }).exec();

        return userModel
    }

    /*public async searchUsersByIds(id: string[]): Promise<IUser[]> {
        const userModel = await this.userModel.find({ _id: { $in: id } }).exec();

        userModel.forEach(function (v) { v.password })
        

        return userModel
    }
    */

    public async updateUserProfileById(id: string, userParams: IUser): Promise<IUser> {
        delete userParams.password
        delete userParams.email
        return this.userModel.updateOne({ _id: id }, userParams).exec();
    }

    public async updateUserById(id: string, userParams: { is_confirmed: boolean }): Promise<IUser> {
        return this.userModel.updateOne({ _id: id }, userParams).exec();
    }

    /*public async searchUsersByCategory(category: number[]): Promise<IUser[]> {
        const users = await this.userModel.find().where('category').all(category).exec();
        users.forEach(function(v) { delete v.password })
        return users
    }
    */
    public async searchUsers(queries: any): Promise<IUser[]> {
        let q: any = {}

        queries.interest ? q.interest = { $exists: true, $ne: null, $in: queries.interest } : q

        //Search for users that satistfy both conditions, and if one of the conditions doesn't exists it ignores it and searches for users that satisfy one of these conditions
        const users = await this.userModel.find(q).exec()

        users ? users.forEach(function (v) { delete v.password }) : users

        return users
    }

    public async createUserLink(id: string): Promise<IUserLink> {
        const userLinkModel = new this.userLinkModel({
            user_id: id,
        });
        return await userLinkModel.save();
    }

    public async getUserLink(link: string): Promise<IUserLink[]> {
        return this.userLinkModel.find({ link, is_used: false }).exec();
    }

    public async updateUserLinkById(id: string, linkParams: { is_used: boolean }): Promise<IUserLink> {
        return this.userLinkModel.updateOne({ _id: id }, linkParams);
    }

    public getConfirmationLink(link: string): string {
        const emailConfirmationLink = `${this.configService.get('BASE_URL')}/users/confirm/${link}`

        console.log(emailConfirmationLink)
        
        return emailConfirmationLink;
    }

    public getAppEmail(): string {
        return `${this.configService.get('APP_EMAIL')}`;
    }
    
    public getAppName(): string {
        return `${this.configService.get('APP_NAME')}`;
    }
}