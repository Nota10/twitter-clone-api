import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsDate,
  IsArray,
  Length,
  IsNumber,
  IsString,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Avatar } from '../../common/interfaces/avatar.interface';
import { UserShort } from '../../common/interfaces/userShort.interface';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  username: string;

  @IsOptional()
  @IsBoolean()
  protected: boolean;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  bio: string;

  @IsOptional()
  @IsDate()
  birthday: Date;

  @IsOptional()
  @IsArray({ each: true })
  followers: UserShort[];

  @IsOptional()
  @IsNumber()
  followersCount: number;

  @IsOptional()
  @IsArray({ each: true })
  following: UserShort[];

  @IsOptional()
  @IsNumber()
  followingCount: number;

  @IsOptional()
  @IsNumber()
  statusesCount: number;

  @IsOptional()
  @IsNumber()
  favoritesCount: number;

  @IsOptional()
  @IsObject()
  avatar: Avatar;
}
