import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { userData } from '../auth/mock-user/user';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    if (request.originalUrl.includes('/auth/signin')) {
      return handler.handle();
    } else {
      const token = request?.headers?.authorization?.split('Bearer ')[1];
      if (token) {
        const user = await jwt.decode(token);
        if (user && user['id'] === userData[0]['id']) {
          request.user = user;
          return handler.handle();
        } else {
          throw new NotFoundException('Token Expired');
        }
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
