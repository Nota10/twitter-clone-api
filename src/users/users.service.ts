import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, LeanDocument } from 'mongoose';

import { User } from './schemas/user.schema';
import { UserShort } from './schemas/userShort.schema';

import { UpdateUserDto } from './dto/update-user.dto';
import { FindResponse } from '../common/responses/find.response';
import { UserResponse } from '../common/responses/user.response';
import { FindIdResponse } from '../common/responses/find-id.response';
import { UpdateResponse } from '../common/responses/update.response';
import { DeleteResponse } from '../common/responses/delete.response';
import { Tweet } from 'src/tweet/schema/tweet.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
    @InjectModel(Tweet.name) public readonly tweetModel: Model<Tweet>,
    @InjectModel(UserShort.name)
    private userShortModel: Model<UserShort>,
  ) {}

  async findAll(): Promise<FindResponse<User>> {
    let result: FindResponse<User>;
    try {
      const users = await this.userModel.find({}, '-password -__v').exec();
      if (users.length === 0) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'Users not found',
          error: 'Not Found',
        };
      } else {
        result = {
          status: HttpStatus.OK,
          message: 'Users found',
          data: users,
        };
      }

      return result;
    } catch (error: any) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };

      return result;
    }
  }

  async getUserTweets(
    loggedUser: any,
    userId: string,
    params: any,
  ): Promise<FindResponse<Tweet>> {
    const user = await this.userModel.findOne({ _id: userId }, '-password');

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `User not found with the given id ${userId}`,
        error: 'Not Found',
      };
    }

    const loggedUserIndex = user.following.indexOf(loggedUser._id);
    if (user.protected && loggedUserIndex === -1) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: `You does not follow user ${userId}`,
        error: 'Unauthorized',
      };
    }

    const query = [];
    query.push(
      {
        $match: { 'user.id': userId },
      },
      {
        $sort: { createdAt: -1 },
      },
    );

    if (params.getChilds === 'true') {
      query.push({
        $lookup: {
          from: 'tweets',
          localField: '_id',
          foreignField: 'parentTweetId',
          as: 'childList',
        },
      });
    }

    const tweets = await this.tweetModel.aggregate(query).exec();

    return {
      status: HttpStatus.OK,
      message: 'Tweets found',
      data: tweets,
    };
  }

  async findOneById(id: string): Promise<FindIdResponse<UserResponse>> {
    let result: FindIdResponse<UserResponse>;
    try {
      const user = await this.userModel.findOne({ _id: id }, '-password');

      if (!user) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with the given id ${id}`,
          error: 'Not Found',
        };
      } else {
        const userResponse = await this.loadUserWithFriends(user);

        result = {
          status: HttpStatus.OK,
          message: 'User found',
          data: userResponse,
        };
      }

      return result;
    } catch (error: any) {
      if (error.kind === 'ObjectId') {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: `ObjectID ${error.value} is not valid`,
          error: 'Cast Error',
        };
      } else {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request',
        };
      }
      return result;
    }
  }

  async findOneByEmail(email: string): Promise<FindIdResponse<User>> {
    let result: FindIdResponse<User>;
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with the given email ${email}`,
          error: 'Not Found',
        };
      } else {
        result = {
          status: HttpStatus.OK,
          message: 'User found',
          data: user,
        };
      }

      return result;
    } catch (error: any) {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };

      return result;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResponse<User>> {
    let result: UpdateResponse<User>;
    try {
      const user = await this.userModel.findById(id);

      if (user) {
        user.set(updateUserDto);

        await user.save();

        result = {
          status: HttpStatus.OK,
          message: 'User updated',
          data: user.set('password', undefined),
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with id ${id}`,
          error: 'Not Found',
        };
      }

      return result;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async updatePassword(
    id: string,
    newPassword: string,
  ): Promise<LeanDocument<User> | null> {
    const user = await this.userModel.findById(id);

    if (user) {
      user.set({ password: newPassword });

      await user.save();

      return user.set('password', undefined).toJSON();
    }
    return null;
  }

  async remove(id: string): Promise<DeleteResponse> {
    let result: DeleteResponse;
    try {
      const user = await this.userModel.findOneAndDelete({ _id: id });

      if (!user) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with the given id ${id}`,
          error: 'Not Found',
        };
      } else {
        // if (user && user.avatar.key !== 'unknown.jpg')
        //   await this.awsService.delete(id);

        result = {
          status: HttpStatus.OK,
          message: 'Delete Successfully',
        };
      }
      return result;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<UpdateResponse<User>> {
    let result: UpdateResponse<User>;
    try {
      const user = await this.userModel.findById(id);

      if (user) {
        // if (user.avatar.key !== 'unknown.jpg')
        // await this.awsService.delete(user.avatar.key);

        // const avatarInfo = await this.awsService.upload(v4(), file);
        const avatarInfo = {
          Key: 'key',
          Location:
            'https://twitterclone-pds-bucket.s3.sa-east-1.amazonaws.com/unknown.jpg',
        };

        const avatar = {
          key: avatarInfo.Key,
          url: avatarInfo.Location,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        user.set('avatar', avatar);

        await user.save();

        result = {
          status: HttpStatus.OK,
          message: `User avatar updated successfully`,
          data: user.set('password', undefined),
        };
      } else {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: `User not found with the given id ${id}`,
          error: 'Not Found',
        };
      }

      return result;
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async followUser(
    loggedUser: any,
    targetUserId: string,
  ): Promise<UpdateResponse<User>> {
    try {
      if (loggedUser._id === targetUserId) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `You can't follow yourself`,
          error: 'Bad Request',
        };
      }

      const user = await this.userModel.findById(loggedUser._id);
      const userFollow = await this.userModel.findById(targetUserId);

      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `User not found with the given id ${loggedUser._id}`,
          error: 'Bad Request',
        };
      }

      if (!userFollow) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `User to follow not found with the given id ${targetUserId}`,
          error: 'Bad Request',
        };
      }

      const indexUser = user.following.indexOf(targetUserId);
      if (indexUser != -1) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `User ${user.username} already follows ${userFollow.username}`,
          error: 'Bad Request',
        };
      }

      user.following.push(targetUserId);
      user.followingCount++;

      userFollow.followers.push(user._id);
      userFollow.followersCount++;

      await user.save();
      await userFollow.save();

      return {
        status: HttpStatus.OK,
        message: `User ${user.username} followed ${userFollow.username} successfully`,
        data: user.set('password', undefined),
      };
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async unfollowUser(
    loggedUser: any,
    targetUserId: string,
  ): Promise<UpdateResponse<User>> {
    try {
      if (loggedUser._id === targetUserId) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `You can't unfollow yourself`,
          error: 'Bad Request',
        };
      }

      const user = await this.userModel.findById(loggedUser._id);
      const userUnfollow = await this.userModel.findById(targetUserId);

      if (!user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `User not found with the given id ${user}`,
          error: 'Bad Request',
        };
      }

      if (!userUnfollow) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `User to unfollow not found with the given id ${targetUserId}`,
          error: 'Bad Request',
        };
      }

      const indexUser = user.following.indexOf(targetUserId);
      const indexUnfollow = userUnfollow.followers.indexOf(loggedUser._id);
      if (indexUser == -1 || indexUnfollow == -1) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `User ${user.username} does not follow ${userUnfollow.username}`,
          error: 'Bad Request',
        };
      }

      user.following.splice(indexUser, 1);
      user.followingCount--;

      userUnfollow.followers.splice(indexUnfollow, 1);
      userUnfollow.followersCount--;

      await user.save();
      await userUnfollow.save();

      return {
        status: HttpStatus.OK,
        message: `User ${user.username} unfollowed ${userUnfollow.username} successfully`,
        data: user.set('password', undefined),
      };
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  private async loadUserWithFriends(
    user: User,
    showPassword = false,
  ): Promise<UserResponse> {
    const friendsSelectFields = 'avatar protected _id name username';

    const followers = await this.userModel.find(
      { _id: user.followers },
      friendsSelectFields,
    );
    const following = await this.userModel.find(
      { _id: user.following },
      friendsSelectFields,
    );

    return {
      password: showPassword ? user.password : undefined,
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      protected: user.protected,
      birthday: user.birthday,
      avatar: user.avatar,
      followersCount: user.followersCount,
      followers,
      followingCount: user.followingCount,
      following,
      bio: user.bio,
      statusesCount: user.statusesCount,
      favoritesCount: user.favoritesCount,
      isActive: user.isActive,
    };
  }
}
