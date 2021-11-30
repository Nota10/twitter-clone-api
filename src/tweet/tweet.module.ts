import { Module } from '@nestjs/common';
import { TweetService } from './tweet.service';
import { TweetController } from './tweet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from './schema/tweet.schema';
import { UserShort, UserShortSchema } from '../users/schemas/userShort.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tweet.name, schema: TweetSchema },
      { name: UserShort.name, schema: UserShortSchema },
    ])
  ],
  controllers: [TweetController],
  providers: [TweetService]
})
export class TweetModule {}
