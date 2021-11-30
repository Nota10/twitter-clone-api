import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Req, Query } from '@nestjs/common';
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
  create(@Body() createTweetDto: CreateTweetDto, @Req() req: Request) {
    return this.tweetService.create(createTweetDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request): Promise<FindResponse<Tweet>> {
    const tweets = await this.tweetService.findAll(req.user);

    if (tweets.error) {
      throw new HttpException(tweets, tweets.status);
    }

    return tweets;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tweet = await this.tweetService.findOne(id);

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
}
