import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Req } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { FindResponse } from '../common/responses/find.response';
import { Tweet } from './schema/tweet.schema';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTweetDto: CreateTweetDto, @Req() req: Request) {
    const tweet = await this.tweetService.create(createTweetDto, req.user);

    if (tweet.error) {
      throw new HttpException(tweet, tweet.status);
    }

    return tweet;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request): Promise<FindResponse<Tweet>> {
    const tweets = await this.tweetService.findAll(req.user, req.query);

    if (tweets.error) {
      throw new HttpException(tweets, tweets.status);
    }

    return tweets;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const tweet = await this.tweetService.findOne(id, req.query);

    if (tweet.error) {
      throw new HttpException(tweet, tweet.status);
    }

    return tweet;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const tweet = await this.tweetService.remove(id, req.user);

    if (tweet.error) {
      throw new HttpException(tweet, tweet.status);
    }

    return tweet;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(@Param('id') id: string, @Req() req: Request) {
    const tweet = await this.tweetService.like(id, req.user);

    if (tweet.error) {
      throw new HttpException(tweet, tweet.status);
    }

    return tweet;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/deslike')
  async deslike(@Param('id') id: string, @Req() req: Request) {
    const tweet = await this.tweetService.deslike(id, req.user);

    if (tweet.error) {
      throw new HttpException(tweet, tweet.status);
    }

    return tweet;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  async share(@Param('id') id: string, @Req() req: Request) {
    const tweet = await this.tweetService.share(id, req.user);

    if (tweet.error) {
      throw new HttpException(tweet, tweet.status);
    }

    return tweet;
  }
}
