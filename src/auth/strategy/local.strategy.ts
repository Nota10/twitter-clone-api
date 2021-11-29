import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { LeanDocument } from 'mongoose';

import { AuthService } from './../auth.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<LeanDocument<User> | HttpException> {
    const user = await this.userService.findOneByEmail(email);

    if (user.data) {
      const isValid = await this.authService.comparePassword(
        password,
        user.data.password as string,
      );

      if (isValid && user.data.isActive) {
        const _user = user.data as User;

        _user.set({
          password: undefined,
          __v: undefined,
          followers: undefined,
          following: undefined,
        });

        return _user.toJSON();
      }
    }

    throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}
