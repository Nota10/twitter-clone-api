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

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name: string;

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
  @Type(() => Date)
  @IsDate()
  birthday: Date;
}
