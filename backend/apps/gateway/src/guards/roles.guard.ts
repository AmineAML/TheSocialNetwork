import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

const logger = new Logger('Gateway')

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
    private reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean /*| Promise<boolean> | Observable<boolean>*/> /*| Promise<boolean> | Observable<boolean>*/ {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log(roles)

    console.log(!roles)

    //Verify that there's a role required, if not allow access to anyone
    if (!roles) {
      return true;
    }

    try {
      /*console.log('ree' + req.headers['authorization']?.split(' ')[1])

      const res: any = await this.authServiceClient.send(
        'token_validate', { access_token: req.headers['authorization']?.split(' ')[1] })
        //.pipe(timeout(5000))
        .toPromise<boolean>();

      console.log(res)

      const user_role = res.data.role
      */

      const req = context.switchToHttp().getRequest();

      const user = req.user

      const authorized = this.matchRoles(roles, user.role);

      console.log(`Is authorized ${authorized}`)

      return authorized
    } catch (err) {
      logger.error(err);
      return false;
    }
    /*const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
    */
  }

  matchRoles(requiredRoles: string[], userRole: string) {
    return requiredRoles.every(role => userRole.includes(role))
  }
}
