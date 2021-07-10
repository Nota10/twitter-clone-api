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
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/avatar/utils/upload.utils';
import { Request } from 'express';
import { AvatarService } from 'src/avatar/avatar.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly avatarService: AvatarService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.remove(id);
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
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    try {
      await this.avatarService.delete(id);
      const avatarInfo = await this.avatarService.upload(id, file);

      return await this.usersService.updateAvatar(
        id,
        avatarInfo.Key,
        avatarInfo.Location,
      );
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
