import { IsNotEmpty, Length, IsString, IsMongoId } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsString()
  @Length(2, 100)
  @IsNotEmpty()
  password: string;
}
