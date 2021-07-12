import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

import { CreateResponse } from 'src/common/responses/create.response';
import { LoginResponse } from 'src/common/responses/login.response';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from 'src/users/schemas/user.schema';

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
    } catch (error) {
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

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    encodedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, encodedPassword);
  }
}
