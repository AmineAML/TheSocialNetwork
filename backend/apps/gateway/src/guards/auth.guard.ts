import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const logger = new Logger('Gateway')

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy) {}
  
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try{
      console.log(req.headers['authorization']?.split(' ')[1])

      const res: any = await this.authServiceClient.send(
        'token_validate', { access_token: req.headers['authorization']?.split(' ')[1]})
        .toPromise<boolean>();

      console.log(res)

      if (res.status !== HttpStatus.OK) {
        console.log('UnAuthorized')
        
        throw new HttpException(
          {
            message: res.message,
            statusCode: res.status
          },
          res.status,
        );
      }

      const user: any = {
        id: res.data.sub,
        role: res.data.role
      }

      req.user = user

      return res;
    } catch(err) {
      logger.error(err);
      throw new UnauthorizedException()
    }
  }
}
