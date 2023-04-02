import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
// import * as argon2 from 'argon2';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // const isPasswordValid = await argon2.verify(user.password, dto.password);

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid Credentials');
      }

      return {
        code: 200,
        message: 'User logged in successfully',
        access_token: await this.signToken(user),
      };
    } catch (error) {
      return {
        error: error.message,
        code: 400,
      };
    }
  }

  async signup(dto: AuthDto) {
    try {
      const existUser = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (existUser) {
        throw new Error('User already exists');
      }

      // const hashedPassword = await argon2.hash(dto.password);
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      delete user.password;

      return {
        code: 201,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      return {
        error: error.message,
        code: 400,
      };
    }
  }

  async signToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
    };
  }
}

// check from 1hour 2 min  https://www.youtube.com/watch?v=2wCpkOk2uCg&list=PLN3n1USn4xlmyw3ebYuZmGp60mcENitdM&index=2
