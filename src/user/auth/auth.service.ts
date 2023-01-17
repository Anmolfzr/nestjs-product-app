import { Injectable, ConflictException, HttpException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { userData } from './mock-user/user';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor() {}
  async signin({ email, password }: SigninParams) {
    const user = await userData.find((user) => user.email === email);
console.log(user);

    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }

    // const hashedPassword = user.password;

    //const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (user.password !== password) {
      throw new HttpException('Invalid credentials', 400);
    }

    return this.generateJWT(user.name, user.id);
  }

  private generateJWT(name: string, id: string) {
    return jwt.sign(
      {
        name,
        id,
      },
      'djnjdnjdn',
      {
        expiresIn: 3600000,
      },
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
