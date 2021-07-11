import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { AwsModule } from 'src/aws/aws.module';
import { UserShort, UserShortSchema } from './schemas/userShort.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserShort.name, schema: UserShortSchema },
    ]),
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
