import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../interfaces/user.interface';
import { IUserLink } from '../interfaces/user-link.interface';
import { IInterest } from '../interfaces/interest.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
        @InjectModel('UserLink') private readonly userLinkModel: Model<IUserLink>,
        private readonly configService: ConfigService,
        @InjectModel('Interest') private readonly interestModel: Model<IInterest>
    ) { }

    public async createUser(user: IUser): Promise<IUser> {
        if (user.interest && user.interest.length > 0) {
            user.interest = user.interest.map(v => v.toLowerCase())
        }
        
        const userModel = await new this.userModel(user).save();

        delete userModel.password

        await this.insertOrIncrementInterest(userModel)

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
        const userModel = await this.userModel.updateOne({ _id: id }, userParams).exec();

        await this.insertOrIncrementInterest(userModel)

        return userModel
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
    public async searchUsers(queries: any, page: number, limit: number, route: string): Promise</*IUser[]*/{ users: IUser[], meta: any, link: any }> {
        let q: any = {}

        queries.interest ? q.interest = { $exists: true, $ne: null, $in: queries.interest } : q

        //Search for users that satistfy both conditions, and if one of the conditions doesn't exists it ignores it and searches for users that satisfy one of these conditions
        const users = await this.userModel.find(q).skip((limit * page) - limit).limit(limit).exec()

        const numberOfUsersInResult = await this.userModel.count(q)

        const meta = {
            itemCount: users!.length,
            totalItems: numberOfUsersInResult,
            itemsPerPage: limit,
            totalPages: Math.ceil(numberOfUsersInResult / limit),
            currentPage: page
        }

        const link = {
            first: numberOfUsersInResult > 0 ? `${route}&limit=${limit}` : '',
            previous: numberOfUsersInResult > 0 ? (page === 1 ? '' : `${route}&page=${page - 1}&limit=${limit}`) : '',
            next: numberOfUsersInResult > 0 ? (page === Math.ceil(numberOfUsersInResult / limit) ? '' : `${route}&page=${page + 1}&limit=${limit}`) : '',
            last: numberOfUsersInResult > 0 ? (`${route}&page=${Math.ceil(numberOfUsersInResult / limit)}&limit=${limit}`) : ''
        }

        users ? users.forEach(function (v) { delete v.password }) : users

        return {
            users,
            meta,
            link
        }
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

    public async getAllInterestBySorting(): Promise<IInterest[]> {
        return this.interestModel.find({}).sort({ byNumberOfUsers: 'desc' }).exec();
    }

    public async insertOrIncrementInterest(userModel: IUser)/*: Promise<IInterest[]>*/ {
        if (userModel.interest && userModel.interest.length > 0) {
            const { interest } = userModel

            // interest.forEach(async interest => {
            //     await this.interestModel.findOneAndUpdate({ 'name': interest.toLowerCase() }, { $inc: { byNumberOfUsers: 1 } }, { new: true, upsert: true })
            // })

            let query = []

            interest.forEach(async interest => {
                //query.push({ 'name': interest.toLowerCase() }, { $inc: { byNumberOfUsers: 1 } }, { new: true, upsert: true })

                await this.interestModel.findOneAndUpdate({ 'name': interest.toLowerCase() }, { $inc: { byNumberOfUsers: 1 } }, { new: true, upsert: true })
            })

            console.log('Improved hobbies')
        }
    }
}