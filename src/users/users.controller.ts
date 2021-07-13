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
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { User } from './schemas/user.schema';
import { imageFileFilter } from 'src/aws/utils/upload.utils';
import { FindIdResponse } from 'src/common/responses/find-id.response';
import { FindResponse } from 'src/common/responses/find.response';
import { DeleteResponse } from 'src/common/responses/delete.response';
import { UpdateResponse } from 'src/common/responses/update.response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    const user = await this.usersService.findOneById(id);
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
  ): Promise<UpdateResponse<User>> {
    const user = await this.usersService.updateAvatar(id, file);

    if (user.error) {
      throw new HttpException(user, user.status);
    }

    return user;
  }

  @Post('follow')
  async followUser(
    @Body() followUserDto: FollowUserDto,
  ): Promise<UpdateResponse<User>> {
    const user = await this.usersService.followUser(followUserDto);

    if (user.error) {
      throw new HttpException(user, user.status);
    }

    return user;
  }

  @Post('unfollow')
  async unfollowUser(
    @Body() unfollowUserDto: FollowUserDto,
  ): Promise<UpdateResponse<User>> {
    const user = await this.usersService.unfollowUser(unfollowUserDto);

    if (user.error) {
      throw new HttpException(user, user.status);
    }

    return user;
  }
}
