import { Model, QueryOptions } from 'mongoose';
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
      console.error('error', error);

      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern)[0];

        throw new BadRequestException(
          `O campo '${duplicateField}' ${error.keyValue[duplicateField]} está duplicado`,
        );
      }

      throw new Error(error);
    }
  }

  async findAll(filters?: any): Promise<User[]> {
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

    user.name = updateUserDto.name || user.name;
    user.bio = updateUserDto.bio || user.bio;
    user.birthday = updateUserDto.birthday || user.birthday;
    user.protected = updateUserDto.protected || user.protected;

    try {
      await this.userModel.replaceOne({ _id: id }, user);
      return await this.findOne(id);
    } catch (error) {
      console.error('error', error);
      throw new Error(error);
    }
  }

  async remove(id: string): Promise<User | null> {
    await this.findOne(id);

    return this.userModel.findOneAndDelete({ _id: id });
  }
}
