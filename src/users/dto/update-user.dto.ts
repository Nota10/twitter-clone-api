import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty()
    @Length(2, 100)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
    
    profilePicture: string;
}
