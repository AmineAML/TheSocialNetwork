import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ITokenDataResponse } from './interfaces/token-data-response.interface';
import { ITokenDestroyResponse } from './interfaces/token-destroy-response.interface';
import { ITokenResponse } from './interfaces/token-response.interface';
import { TokenService } from './services/token.service';

@Controller()
export class ServiceAuthController {
  constructor(private readonly tokenService: TokenService) { }

  @MessagePattern('token_create')
  public async createToken(data: { userId: string, role: string }): Promise<ITokenResponse> {
    let result: ITokenResponse;
    if (data /*&& data.userId*/) {
      try {
        const createResult = await this.tokenService.createToken(data/*.userId*/);
        result = {
          status: HttpStatus.CREATED,
          message: 'token_create_success',
          access_token: createResult.token,
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'token_create_bad_request',
          access_token: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'token_create_bad_request',
        access_token: null,
      };
    }

    return result;
  }

  @MessagePattern('token_destroy')
  public async destroyToken(data: { userId: string }): Promise<ITokenDestroyResponse> {
    return {
      status: data && data.userId ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
      message:
        data && data.userId
          ? (await this.tokenService.deleteTokenForUserId(data.userId)) &&
          'token_destroy_success'
          : 'token_destroy_bad_request',
      errors: null,
    };
  }

  @MessagePattern('token_decode')
  public async decodeToken(data: { access_token: string }): Promise<ITokenDataResponse> {
    console.log(data)

    const tokenData = await this.tokenService.decodeToken(data.access_token);

    console.log(tokenData)

    return {
      status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
      message: tokenData ? 'token_decode_success' : 'token_decode_unauthorized',
      data: tokenData,
    };
  }

  @MessagePattern('token_validate')
  public async loggedIn(data: { access_token: string }): Promise<ITokenDataResponse> {
    console.log(data)

    const tokenData = await this.tokenService.validateToken(data.access_token)//.decodeToken(data.token);

    console.log(tokenData)

    return {
      status: tokenData ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
      message: tokenData ? 'token_validate_success' : 'token_validate_unauthorized',
      data: tokenData,
    };
  }
}
