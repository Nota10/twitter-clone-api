import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);

      user.password = bcrypt.hashSync(
        createUserDto.password,
        bcrypt.genSaltSync(8),
      );

      await user.save();
      return await this.findOne(user._id);
    } catch (error) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];

        throw new BadRequestException(
          `O campo '${duplicateField}' ${error.keyValue[duplicateField]} está duplicado`,
        );
      }

      throw new Error(error);
    }
  }

  async findAll(
    filters: any = { __v: false, password: false },
  ): Promise<User[]> {
    try {
      return await this.userModel.find({}, filters).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(
    id: string,
    filters: any = { __v: false, password: false },
  ): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }, filters);

    if (!user) throw new BadRequestException('Esse usuário não existe.');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto | User): Promise<User> {
    const user = await this.findOne(id, null);

    if (!bcrypt.compareSync(updateUserDto.password, user.password))
      throw new UnauthorizedException('Credenciais inválidas.');

    try {
      await this.userModel.updateOne({ _id: id }, { $set: updateUserDto });
      return await this.findOne(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ _id: id });
  }

  async updateAvatar(id: string, key: string, url: string): Promise<User> {
    await this.userModel.updateOne(
      { _id: id },
      { $set: { 'avatar.key': key, 'avatar.url': url } },
    );
    return await this.findOne(id);
  }
}
