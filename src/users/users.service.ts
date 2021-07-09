import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    await this.checkUniques(createUserDto);

    const user = new this.userModel(createUserDto);

    return await user.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }, { __v: false });

    if (!user) throw new BadRequestException('This user does not exists');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.checkUniques(updateUserDto);

    return await this.userModel.replaceOne({ _id: id }, updateUserDto);
  }

  async remove(id: string): Promise<User | null> {
    await this.findOne(id);

    return this.userModel.findOneAndDelete({ _id: id });
  }

  private async checkUniques(
    userDTO: CreateUserDto | UpdateUserDto,
  ): Promise<void> {
    const emailUser = await this.userModel.findOne({
      email: userDTO.email,
    });
    const usernameUser = await this.userModel.findOne({
      username: userDTO.username,
    });

    if (emailUser) throw new BadRequestException('Email is already in use.');
    if (usernameUser)
      throw new BadRequestException('Username is already in use.');
  }
}
