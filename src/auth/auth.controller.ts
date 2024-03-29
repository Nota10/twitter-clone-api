import {
  Body,
  Get,
  HttpCode,
  HttpException,
  Logger,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Request } from 'express';
import { LeanDocument } from 'mongoose';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginResponse } from '../common/responses/login.response';
import { CreateResponse } from '../common/responses/create.response';
import { UpdateUserPasswordDto } from './dto/update-user-pw.dto';
import { UpdateResponse } from '../common/responses/update.response';
import { User } from '../users/schemas/user.schema';


@Controller('auth')
export class AuthController {
  constructor(public readonly authService: AuthService) {}
  public logger: Logger = new Logger('AuthController');

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  async login(@Req() req: Request): Promise<LoginResponse> {
    const userLogin = this.authService.login(req.user);
    if (userLogin.status !== 200) {
      throw new HttpException(userLogin, userLogin.status);
    }

    return userLogin;
  }

  @Post('register')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateResponse<User>> {
    const user = await this.authService.registerUser(createUserDto);
    if (user.error) {
      throw new HttpException(user, user.status);
    }
    return user;
  }

  @Patch('password')
  async updatePassword(
    @Body() updateUserPassword: UpdateUserPasswordDto,
  ): Promise<UpdateResponse<LeanDocument<User>>> {
    const user = await this.authService.updatePassword(updateUserPassword);
    if (user.error) {
      throw new HttpException(user, user.status);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProfile(@Req() req: Request): Express.User | undefined {
    return req.user;
  }
}
