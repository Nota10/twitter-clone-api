import { IsEmail, IsNotEmpty, IsBoolean, IsDate, IsArray, Length, IsNumber, IsString } from 'class-validator';
import { Date } from 'mongoose';

type UserShort = {
    id: string;
    name: string;
    username: string;
    protected: boolean;
    avatar: Avatar;
};

type Avatar = {
    key: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 100)
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    username: string;

    @IsBoolean()
    protected: boolean;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @Length(1, 255)
    bio: string

    @IsDate()
    birthday: Date

    @IsArray()
    followers: UserShort[]

    @IsNumber()
    followersCount: number

    @IsArray()
    following: UserShort[]

    @IsNumber()
    followingCount: number
    
    @IsNumber()
    statusesCount: number;

    avatar: Avatar;
}