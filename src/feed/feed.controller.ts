import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FeedService } from './feed.service';

@Controller('')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  find(@Req() req: Request) {
    return this.feedService.find(req.user, req.query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  search(@Req() req: Request) {
    return this.feedService.search(req.body);
  }
}
