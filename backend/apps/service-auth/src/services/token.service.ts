import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from '../interfaces/token.interface';

const logger = new Logger('Auth')

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('Token') private readonly tokenModel: Model<IToken>,
    ) { }

    public createToken(data: { userId: string, role: string }): Promise<IToken> {
        const token = this.jwtService.sign(
            {
                sub: data.userId,
                role: data.role,
            },
            /*{
                expiresIn: 30 * 24 * 60 * 60,
            },
            */
        );

        return new this.tokenModel({
            user_id: data.userId,
            token,
        }).save();
    }

    public deleteTokenForUserId(userId: string): Query<any, any> {
        return this.tokenModel.remove({
            user_id: userId,
        });
    }

    //This is more useful with verifying the refresh token is valid, not storing the token meaning the access_token
    public async decodeToken(token: string) {
        let result = null;

        console.log(token)

        try {
            const tokenData = this.jwtService.decode(token) as {
                exp: number,
                sub: string,
                role: string
            }

            console.log(tokenData)

            if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
                result = null;

                console.log(`null ${result}`)
            } else {
                result = {
                    userId: tokenData.sub,
                    role: tokenData.role
                };

                console.log(`Not null ${result}`)
            }
        } catch (e) {
            result = null;
        }
        return result;
    }

    //Verify the token meaning the access_token is valid
    public async validateToken(access_token: string) {
        console.log(access_token)

        let result = null

        try {
            const verifyJWT = this.jwtService.verify(access_token)

            console.log(verifyJWT)

            result = verifyJWT
        } catch (e) {
            logger.error(e)

            result = null
        }

        return result
    }

    //This is more useful with verifying the refresh token is valid, not storing the token meaning the access_token
    /*public async decodeToken(token: string) {
        const tokenModel = await this.tokenModel.find({
            token,
        });
        let result = null;

        if (tokenModel && tokenModel[0]) {
            try {
                const tokenData = this.jwtService.decode(tokenModel[0].token) as {
                    exp: number;
                    //userId: any;
                    sub: any
                };
                if (!tokenData || tokenData.exp <= Math.floor(+new Date() / 1000)) {
                    result = null;
                } else {
                    result = {
                        userId: tokenData.sub//.userId,
                    };
                }
            } catch (e) {
                result = null;
            }
        }
        return result;
    }
    */
}
