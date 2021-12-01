import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LeanDocument } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserPasswordDto } from './dto/update-user-pw.dto';
import { UsersService } from '../users/users.service';
import { LoginResponse } from '../common/responses/login.response';
import { UpdateResponse } from '../common/responses/update.response';
import { User } from '../users/schemas/user.schema';
import { CreateResponse } from '../common/responses/create.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  login(data: Express.User | undefined): LoginResponse {
    let result: LoginResponse;
    if (data) {
      result = {
        status: HttpStatus.OK,
        message: 'Successfully logged in',
        accessToken: this.jwtService.sign(data),
      };
    } else {
      result = {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized login',
      };
    }

    return result;
  }

  async updatePassword(
    updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<UpdateResponse<LeanDocument<User>>> {
    let result: UpdateResponse<LeanDocument<User>>;
    const { userId, password } = updateUserPasswordDto;
    try {
      const newPassword = await this.hashPassword(password);
      const user = await this.usersService.updatePassword(userId, newPassword);

      if (!user) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not Found',
        };
      } else {
        result = {
          status: HttpStatus.OK,
          message: 'User password updated successfully',
          data: user,
        };
      }

      return result;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateResponse<User>> {
    let result: CreateResponse<User>;
    try {
      const user = new this.usersService.userModel(createUserDto);

      user.password = await this.hashPassword(createUserDto.password);

      await user.save();

      const data = user.set('password', undefined);

      result = {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data,
      };

      return result;
    } catch (error: any) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];

        result = {
          status: HttpStatus.CONFLICT,
          message: `O campo '${duplicateField}' ${error.keyValue[duplicateField]} está duplicado`,
          error: 'Duplicate Key',
        };
      } else {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request',
        };
      }

      return result;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    encodedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, encodedPassword);
  }
}
