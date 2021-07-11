import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsDate,
  Length,
  IsString,
  IsOptional,
} from 'class-validator';
import { Date } from 'mongoose';

export class CreateUserDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 50)
  username: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  bio: string;

  @IsOptional()
  @IsBoolean()
  protected: boolean;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Type(() => Date)
  @IsDate()
  birthday: Date;
}
