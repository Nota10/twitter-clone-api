import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    createUserDto.password = bcrypt.hashSync(
      createUserDto.password,
      bcrypt.genSaltSync(8),
    );

    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<any> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const user = await this.usersService.findOne(id);

    if (!bcrypt.compareSync(updateUserDto.password, user.password))
      throw new UnauthorizedException('Invalid user credentials');

    updateUserDto.password = user.password;

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.usersService.remove(id);
  }
}
