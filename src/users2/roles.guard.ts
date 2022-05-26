import { UserEntity } from 'src/users/user.entity';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { UserRole } from './entities/user-role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user as UserEntity;
    if (!user) {
      throw new UnauthorizedException(ExceptionMessage.UNAUTHORIZED);
    } else if (requiredRoles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException(ExceptionMessage.FORBIDDEN);
    }
  }
}
