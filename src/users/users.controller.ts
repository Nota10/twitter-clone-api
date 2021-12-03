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
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { User } from './schemas/user.schema';
import { UserResponse } from '../common/responses/user.response';
import { FindResponse } from '../common/responses/find.response';
import { FindIdResponse } from '../common/responses/find-id.response';
import { UpdateResponse } from '../common/responses/update.response';
import { DeleteResponse } from '../common/responses/delete.response';
import { imageFileFilter } from './utils/upload.utils';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { Tweet } from 'src/tweet/schema/tweet.schema';

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
  async findOne(
    @Param('id') id: string,
  ): Promise<FindIdResponse<UserResponse>> {
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

  @UseGuards(JwtAuthGuard)
  @Get(':id/tweets')
  async getUserTweets(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FindResponse<Tweet>> {
    const { user, query } = req;
    const tweets = await this.usersService.getUserTweets(user, id, query);

    if (tweets.error) {
      throw new HttpException(tweets, tweets.status);
    }

    return tweets;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async followUser(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UpdateResponse<User>> {
    const user = await this.usersService.followUser(req.user, id);

    if (user.error) {
      throw new HttpException(user, user.status);
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unfollow')
  async unfollowUser(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<UpdateResponse<User>> {
    const user = await this.usersService.unfollowUser(req.user, id);

    if (user.error) {
      throw new HttpException(user, user.status);
    }

    return user;
  }
}
