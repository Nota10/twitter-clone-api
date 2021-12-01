import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tweet } from 'src/tweet/schema/tweet.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Tweet.name) public readonly tweetModel: Model<Tweet>,
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
}
