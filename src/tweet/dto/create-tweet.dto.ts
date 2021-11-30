import {
  Length,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateTweetDto {
  @IsString()
  @Length(2, 50)
  title: string;

  @IsString()
  @Length(2, 144)
  body: string;

  @IsOptional()
  images: String[];
}
