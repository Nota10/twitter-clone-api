import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tweet } from 'src/tweet/schema/tweet.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Tweet.name) public readonly tweetModel: Model<Tweet>,
    @InjectModel(User.name) public readonly userModel: Model<User>,
  ) {}

  async find(user: any, params: any) {
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `User not found`,
        error: 'Not Found',
      };
    }

    let perPage = 10;
    if (params.per_page != undefined) {
      perPage = parseInt(params.per_page);
    }

    let page = perPage * 0;
    if (params.page != undefined) {
      page = perPage * parseInt(params.page);
    } 

    const tweets = await this.tweetModel.find({}).sort({createdAt: -1}).skip(page).limit(perPage).exec()

    return {
      status: HttpStatus.OK,
      message: 'Feed',
      data: tweets
    };
  }

  async search(body: any) {
    const searchText = body.search;
    const searchIdentificator = searchText.charAt(0);

    if (searchIdentificator == '@') {
      const username = searchText.slice(1);
      return await this.searchUser(username)
    }

    if (searchIdentificator == '#') {
      const hashtag = searchText.slice(1);
      return await this.searchHashtag(hashtag)
    }

    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Search string not valid',
      error: 'Bad Request',
    };
  }

  async searchUser(username: string) {
    const user = await this.userModel.find({ username: { $regex: '.*' + username + '.*' } }).exec();

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `User with username '${username}' not found`,
        error: 'Not found',
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'User',
      data: user
    };
  }

  async searchHashtag(hashtag: string) {
    const tweets = await this.tweetModel.find({ "hashtags": hashtag }).sort({ createdAt: -1 }).limit(10).exec();

    if (tweets.length === 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Tweets with this hashtag were not found`,
        error: 'Not found',
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Tweet',
      data: tweets
    };
  }
}
