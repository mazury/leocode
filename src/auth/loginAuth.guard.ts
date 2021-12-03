import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './constants';

@Injectable()
export class LoginAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization.replace(/^Bearer\s/, '');
      jwt.verify(token, jwtConstants.secret);
      return true;
    } catch (e) {
      return false;
    }
  }
}
