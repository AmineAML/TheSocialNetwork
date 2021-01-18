import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';

const logger = new Logger('Gateway')

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log(roles)

    console.log(!roles)

    //Verify that there's a role required, if not allow access to anyone
    if (!roles) {
      return true;
    }

    try {
      const req = context.switchToHttp().getRequest();

      const user = req.user

      const authorized = this.matchRoles(roles, user.role);

      console.log(`Is authorized ${authorized}`)

      return authorized
    } catch (err) {
      logger.error(err);
      return false;
    }
  }

  matchRoles(requiredRoles: string[], userRole: string) {
    let isMatchedRole = false

    requiredRoles.forEach(role => {
      if (userRole.includes(role)) {
        isMatchedRole = true
      }
    })

    return isMatchedRole
    
    //return requiredRoles.every(role => userRole.includes(role))
  }
}
