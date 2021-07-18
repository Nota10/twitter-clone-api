import {
  IsBoolean,
  IsString,
  IsInt,
  IsArray,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from 'src/auth/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @IsOptional()
  favoritesCount?: number;

  @IsInt()
  @IsOptional()
  statusesCount?: number;

  @IsInt()
  @IsOptional()
  followingCount?: number;

  @IsInt()
  @IsOptional()
  followersCount?: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsBoolean()
  @IsOptional()
  protected?: boolean;

  @IsArray({ each: true })
  @IsOptional()
  following?: string[];

  @IsArray({ each: true })
  @IsOptional()
  followers?: string[];
}
