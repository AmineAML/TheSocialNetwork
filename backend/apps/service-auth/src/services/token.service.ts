import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { IToken } from '../interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt'

const logger = new Logger('Auth')

@Injectable()
export class TokenService {
    public jwt_access_token_secret: string

    public jwt_refresh_token_secret: string

    public SALT_ROUNDS: number

    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('Token') private readonly tokenModel: Model<IToken>,
        private readonly configService: ConfigService
    ) {
        this.jwt_access_token_secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET')

        this.jwt_refresh_token_secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET')

        this.SALT_ROUNDS = Number(this.configService.get('BCRYPT_SALT_ROUNDS'))
    }

    public async createToken(data: { userId: string, role: string }): Promise<IToken> {
        const access_token = await this.signToken(data.userId, data.role, /*'900s'*/'180s', this.jwt_access_token_secret)

        const refresh_token = await this.signToken(data.userId, data.role, '1h', this.jwt_refresh_token_secret)

        //Assign the refresh token to the user, if the user already has a refresh token then overwrite it, else create a new document with the user's id and refresh token
        const hashed_refresh_token = await bcrypt.hash(refresh_token, this.SALT_ROUNDS);

        await this.tokenModel.findOneAndUpdate({ 'user_id': data.userId }, { refresh_token: hashed_refresh_token }, { new: true, upsert: true })

        let newToken: any = {}

        newToken.access_token = access_token

        //Cookie of refresh token
        //newToken.refresh_token = `Refresh=${refresh_token}; Secure; HttpOnly; Path=/; Max-Age=3600000`; //max age of refresh token of 1 hour as milliseconds
        
        newToken.refresh_token = refresh_token

        return newToken
    }

    //Verify the token meaning the access_token is valid
    public async validateToken(access_token: string) {
        console.log(access_token)

        let result = null

        try {
            const verifyJWT = this.jwtService.verify(access_token, {
                secret: this.jwt_access_token_secret
            })

            console.log(verifyJWT)

            result = verifyJWT
        } catch (e) {
            logger.error(e)

            result = null
        }

        console.log(`Rslt ${result}`)

        return result
    }

    public async refreshToken(refresh_token: string) {
        let result = null;

        console.log(refresh_token)

        try {
            //This throws an error if it's expired, else it continues
            const verifyJWT = this.jwtService.verify(refresh_token, {
                secret: this.jwt_refresh_token_secret
            })

            console.log(verifyJWT)

            const tokenModel = await this.tokenModel.findOne({
                user_id: verifyJWT.sub
            });

            console.log(tokenModel)

            if (tokenModel) {
                const isRefreshTokenMatching = await bcrypt.compare(refresh_token, tokenModel.refresh_token)

                if (isRefreshTokenMatching) {
                    const data = {
                        userId: verifyJWT.sub,
                        role: verifyJWT.role
                    }

                    const access_token = await this.signToken(data.userId, data.role, '900s', this.jwt_access_token_secret)

                    result = {
                        access_token
                    };
                } else {
                    result = null
                }
            } else {
                result = null
            }
        } catch (e) {
            logger.error(e)

            result = null
        }
        return result;
    }

    //Remove the document of user'id and refresh token
    public deleteTokenForUserId(userId: string): Query<any, any> {
        return this.tokenModel.remove({
            user_id: userId,
        });
    }

    private async signToken(userId: string, role: string, expiresIn: string, secret: string): Promise<string> {
        return this.jwtService.sign(
            {
                sub: userId,
                role: role,
            },
            {
                expiresIn,
                secret
            },
        );
    }
}
