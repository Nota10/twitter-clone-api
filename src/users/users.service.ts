import { Model } from 'mongoose';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    let user = new this.userModel(createUserDto);

    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));

    return user.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findById(id, { __v: false, password: false });
    } catch {
      throw new BadRequestException("This user does not exists");
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOne({_id: id}, { __v: false});

    if (!user)
      throw new BadRequestException("This user does not exists");

    console.log(updateUserDto.password, user.password);

    if (!bcrypt.compareSync(updateUserDto.password, user.password)) {
      throw new UnauthorizedException("Invalid user");
    }

    updateUserDto.password = bcrypt.hashSync(updateUserDto.password, bcrypt.genSaltSync(8));

    return this.userModel.updateOne( {_id: id}, updateUserDto );
  }

  async remove(id: string) {
    return await this.userModel.findOneAndDelete( {_id: id} );
  }
}
