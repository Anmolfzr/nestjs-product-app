import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { userData } from 'src/user/auth/mock-user/user';

interface JWTPayload {
  name: string;
  id: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (request.originalUrl.includes('/auth/signin')) {
      return true;
    } else {
      const token = request.headers?.authorization?.split('Bearer ')[1];
      const JSON_TOKEN_KEY = 'h3820th2309gth23-9gh32-0gj9-hsg0832hg0912021';
      if (token) {
        try {
          const payload = (await jwt.verify(
            token,
            JSON_TOKEN_KEY,
          )) as JWTPayload;
          if (payload && payload['id'] === userData[0]['id']) {
            return true;
          }
        } catch (error) {
          return false;
        }
      }
    }
  }
}
