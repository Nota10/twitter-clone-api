import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
        status: HttpStatus.UNAUTHORIZED,
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

  async findAll(user: any, params: any): Promise<FindResponse<Tweet>> {
    try {
      if (user === undefined) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'The user is not logged',
          error: 'Unauthorized',
        };
      }

      const query = [];
      query.push({ 
        $match: {"user.id": user._id},
      }, {
        $sort: { createdAt: -1 }
      });

      if (params.get_childs === 'true') {
        query.push({
          $lookup: {
            from: 'tweets',
            localField: '_id',
            foreignField: 'parentTweetId',
            as: 'childList'
          }
        });
      }

      const tweets = await this.tweetModel.aggregate(query).exec()

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
    } catch (error: any) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }

  async findOne(id: string, params: any): Promise<FindIdResponse<object>> {
    try {
      const tweet = await this.tweetModel.findOne({_id: id}, '-__v');

      if (!tweet) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: `Tweet not found with the given id ${id}`,
          error: 'Not Found',
        };
      }

      tweet.set('childList', [], {strict: false});
      if (params.get_childs === 'true') {
        const childTweets = await this.tweetModel.find({parentTweetId: tweet._id}, '-__v');
        tweet.set('childList', childTweets, {strict: false});
      }

      return {
        status: HttpStatus.OK,
        message: 'Tweet found',
        data: tweet,
      };    
    } catch (error: any) {
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

  async like(id: string, user: any): Promise<FindIdResponse<Tweet>> {
    const tweet = await this.tweetModel.findOne({_id: id});

    if (!tweet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Tweet not found with the given id ${id}`,
        error: 'Not Found',
      };
    }

    const userIdIndex = tweet.likeList.indexOf(user._id);
    if (userIdIndex === -1) {
      tweet.likeCount += 1;
      tweet.likeList.push(user._id);
    } else {
      tweet.likeCount -= 1;
      tweet.likeList.splice(userIdIndex, 1);
    }

    await tweet.save();

    return {
      status: HttpStatus.OK,
      message: 'Tweet found',
      data: tweet,
    };   
  }

  async deslike(id: string, user: any): Promise<FindIdResponse<Tweet>> {
    const tweet = await this.tweetModel.findOne({_id: id});

    if (!tweet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Tweet not found with the given id ${id}`,
        error: 'Not Found',
      };
    }

    const userIdIndex = tweet.deslikeList.indexOf(user._id);
    if (userIdIndex === -1) {
      tweet.deslikeCount += 1;
      tweet.deslikeList.push(user._id);
    } else {
      tweet.deslikeCount -= 1;
      tweet.deslikeList.splice(userIdIndex, 1);
    }

    await tweet.save();

    return {
      status: HttpStatus.OK,
      message: 'Tweet found',
      data: tweet,
    };   
  }

  async share(id: string, user: any): Promise<FindIdResponse<Tweet>> {
    const parentTweet = await this.tweetModel.findOne({_id: id});

    if (!parentTweet) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: `Tweet not found with the given id ${id}`,
        error: 'Not Found',
      };  
    }

    const userShort = new this.userShortModel({
      id: user._id,
      name: user.name ,
      username: user.username,
      protected: user.protected,
      avatar: user.avatar
    })

    const childTweet = new this.tweetModel(parentTweet);

    childTweet._id = new Types.ObjectId();
    childTweet.parentTweetId = parentTweet._id;
    childTweet.user = userShort;
    childTweet.deslikeCount = 0;
    childTweet.deslikeList = [];
    childTweet.likeCount = 0;
    childTweet.likeList = [];
    childTweet.isNew = true;

    await childTweet.save();

    return {
      status: HttpStatus.OK,
      message: `Tweet shared`,
      data: childTweet,
    };  
  }
}
