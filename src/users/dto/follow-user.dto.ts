import { IsMongoId, IsNotEmpty } from 'class-validator';

export class FollowUserDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}
