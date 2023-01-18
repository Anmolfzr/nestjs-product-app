import { Injectable, ConflictException, HttpException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userData } from './mock-user/user';

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor() {}
  async signin({ email, password }: SigninParams) {
    const user = await userData.find((user) => user.email === email);
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }
    if (user.password !== password) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this.generateJWT(user.name, user.id);
  }

  private generateJWT(name: string, id: string) {
   const JSON_TOKEN_KEY="h3820th2309gth23-9gh32-0gj9-hsg0832hg0912021"
    return jwt.sign(
      {
        name,
        id,
      },
      JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }
}
