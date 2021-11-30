import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateResponse } from '../common/responses/create.response';
import { DeleteResponse } from '../common/responses/delete.response';
import { FindResponse } from '../common/responses/find.response';
import { FindIdResponse } from '../common/responses/find-id.response';
import { UserShort } from '../users/schemas/userShort.schema';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { Tweet } from './schema/tweet.schema';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name) public readonly tweetModel: Model<Tweet>,
    @InjectModel(UserShort.name) private userShortModel: Model<UserShort>,
  ) {}

  async create(createTweetDto: CreateTweetDto, user: any): Promise<CreateResponse<Tweet>> {
    if (!user) {
      return {
        status: HttpStatus.NON_AUTHORITATIVE_INFORMATION,
        message: "User not found",
        error: "Unauthorized"
      }
    }

    const tweet = new this.tweetModel(createTweetDto);
    const userShort = new this.userShortModel({
      id: user._id,
      name: user.name ,
      username: user.username,
      protected: user.protected,
      avatar: user.avatar
    })

    tweet.hashtags = getHashtags(createTweetDto.body);
    tweet.user = userShort;

    await tweet.save();

    return {
      status: HttpStatus.CREATED,
      message: "Tweet created",
      data: tweet
    }

    function getHashtags(text : string) {
      var hashTags, i, len, word, words;
      words = text.split(/[\s\r\n]+/);
      hashTags = [];
      for (i = 0, len = words.length; i < len; i++) {
        word = words[i];
        if (word.indexOf('#') === 0) {
          hashTags.push(word.replace('#', ''));
        }
      }
      return hashTags;
    }
  }

  async findAll(user: any): Promise<FindResponse<Tweet>> {
    try {
      let query = {};
      if (user !== undefined) {
        query = {"user.id": user._id};
      }

      console.log(query)

      const tweets = await this.tweetModel.find(query, '-__v').exec();

      if (tweets.length === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Tweets not found',
          error: 'Not Found',
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Tweets found',
        data: tweets
      };
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async findOne(id: string): Promise<FindIdResponse<Tweet>> {
    try {
      const tweet = await this.tweetModel.findOne({_id: id});

      if (!tweet) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `Tweet not found with the given id ${id}`,
          error: 'Not Found',
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'Tweet found',
        data: tweet,
      };    
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async remove(id: string, user: any): Promise<DeleteResponse> {
    const tweet = await this.tweetModel.findOne({_id: id});

    if (!tweet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Tweet not found with the given id ${id}`,
        error: 'Not Found',
      };
    }

    if (tweet.user.id != user._id) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: `This tweet does not belong to this user`,
        error: 'Unauthorized',
      };
    }

    await this.tweetModel.deleteOne({_id: id});

    return {
      status: HttpStatus.OK,
      message: 'Tweet deleted'
    };   
  }
}
