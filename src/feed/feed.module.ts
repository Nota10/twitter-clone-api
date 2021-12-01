import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tweet, TweetSchema } from 'src/tweet/schema/tweet.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tweet.name, schema: TweetSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}
