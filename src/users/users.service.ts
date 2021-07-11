import { Model } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { AwsService } from 'src/aws/aws.service';
import { v4 } from 'uuid';

import * as bcrypt from 'bcrypt';
import { UserShort } from './schemas/userShort.schema';

import { CreateResponse } from 'src/common/responses/create.response';
import { FindIdResponse } from 'src/common/responses/find-id.response';
import { FindResponse } from 'src/common/responses/find.response';
import { DeleteResponse } from 'src/common/responses/delete.response';
import { UpdateResponse } from 'src/common/responses/update.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserShort.name)
    private userShortModel: Model<UserShort>,
    private readonly awsService: AwsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateResponse<User>> {
    let result: CreateResponse<User>;
    try {
      const user = new this.userModel(createUserDto);

      user.password = bcrypt.hashSync(
        createUserDto.password,
        bcrypt.genSaltSync(8),
      );

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

  async findAll(): Promise<FindResponse<User>> {
    let result: FindResponse<User>;
    try {
      const users = await this.userModel.find({}, '-password -__v').exec();
      if (users.length === 0) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'Users not found',
          error: 'Not Found',
        };
      } else {
        result = {
          status: HttpStatus.OK,
          message: 'User found',
          data: users,
        };
      }

      return result;
    } catch (error) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };

      return result;
    }
  }

  async findOne(id: string): Promise<FindIdResponse<User>> {
    let result: FindIdResponse<User>;
    try {
      const user = await this.userModel.findOne({ _id: id }, '-password');

      if (!user) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with the given id ${id}`,
          error: 'Not Found',
        };
      } else {
        result = {
          status: HttpStatus.OK,
          message: 'User found',
          data: user,
        };
      }

      return result;
    } catch (error) {
      if (error.kind === 'ObjectId') {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: `ObjectID ${error.value} is not valid`,
          error: 'Cast Error',
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResponse<User>> {
    let result: UpdateResponse<User>;
    try {
      const user = await this.userModel.findById(id);

      if (user) {
        user.set(updateUserDto);

        await user.save();

        result = {
          status: HttpStatus.OK,
          message: 'User updated',
          data: user.set('password', undefined),
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with id ${id}`,
          error: 'Not Found',
        };
      }

      return result;
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async remove(id: string): Promise<DeleteResponse> {
    let result: DeleteResponse;
    try {
      const user = await this.userModel.findOneAndDelete({ _id: id });

      if (!user) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with the given id ${id}`,
          error: 'Not Found',
        };
      } else {
        if (user && user.avatar.key !== 'unknown.jpg')
          await this.awsService.delete(id);

        result = {
          status: HttpStatus.OK,
          message: 'Delete Successfully',
        };
      }
      return result;
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<UpdateResponse<User>> {
    let result: UpdateResponse<User>;
    try {
      const user = await this.userModel.findById(id);

      if (user) {
        if (user.avatar.key !== 'unknown.jpg')
          await this.awsService.delete(user.avatar.key);

        const avatarInfo = await this.awsService.upload(v4(), file);

        const avatar = {
          key: avatarInfo.Key,
          url: avatarInfo.Location,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        user.set('avatar', avatar);

        await user.save();

        result = {
          status: HttpStatus.OK,
          message: `User avatar updated successfully`,
          data: user.set('password', undefined),
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with the given id ${id}`,
          error: 'Not Found',
        };
      }

      return result;
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }
}
