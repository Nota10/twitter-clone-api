import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  IsInt,
  IsArray,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';
import { UserShort } from '../schemas/userShort.schema';

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

  @Type(() => UserShort)
  @IsArray({ each: true })
  @IsOptional()
  following?: UserShort[];

  @Type(() => UserShort)
  @IsArray({ each: true })
  @IsOptional()
  followers?: UserShort[];
}
