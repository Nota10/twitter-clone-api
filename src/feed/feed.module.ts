import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from 'src/tweet/schema/tweet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tweet.name, schema: TweetSchema },
    ])
  ],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}
