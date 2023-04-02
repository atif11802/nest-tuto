import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  async getme(@GetUser() user: User) {
    return user;
  }
}

//2 hour 9 min
