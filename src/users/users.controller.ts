import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { imageFileFilter } from 'src/aws/utils/upload.utils';
import { AwsService } from 'src/aws/aws.service';
import { CreateResponse } from 'src/common/responses/create.response';
import { FindIdResponse } from 'src/common/responses/find-id.response';
import { FindResponse } from 'src/common/responses/find.response';
import { DeleteResponse } from 'src/common/responses/delete.response';
import { UpdateResponse } from 'src/common/responses/update.response';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly awsService: AwsService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateResponse<User>> {
    const user = await this.usersService.create(createUserDto);
    if (user.error) {
      throw new HttpException(user, user.status);
    }
    return user;
  }

  @Get()
  async findAll(): Promise<FindResponse<User>> {
    const users = await this.usersService.findAll();
    if (users.error) {
      throw new HttpException(users, users.status);
    }
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FindIdResponse<User>> {
    const user = await this.usersService.findOne(id);
    if (user.error) {
      throw new HttpException(user, user.status);
    }
    return user;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResponse<User>> {
    const user = await this.usersService.update(id, updateUserDto);

    if (user.error) {
      throw new HttpException(user, user.status);
    }

    return user;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponse> {
    const user = await this.usersService.remove(id);

    if (user.error) {
      throw new HttpException(user, user.status);
    }

    return user;
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        files: 1,
        fileSize: 1048576 * 5, // 5mb
      },
      fileFilter: imageFileFilter,
    }),
  )
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      const user = await this.usersService.updateAvatar(id, file);
      return user;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
