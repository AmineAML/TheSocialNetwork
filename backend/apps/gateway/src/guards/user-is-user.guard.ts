import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IServiceUserGetByIdResponse } from '../interfaces/user/service-account-get-by-id-response.interface';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(@Inject('ACCOUNT_SERVICE') private readonly accountServiceClient: ClientProxy) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const params = request.params

    const userId = request.user.id

    const userResponse: IServiceUserGetByIdResponse = await this.accountServiceClient
      .send('user_get_by_id', userId)
      .toPromise();

    let hasPermission = false

    if (userResponse.user) {
      if (userResponse.user.id === params.id) {
        hasPermission = true
      }
    }

    return hasPermission
  }
}
