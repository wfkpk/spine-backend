import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'src/interface/response';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @SkipThrottle(true)
  @Get('/ping')
  getPing() {
    return {
      data: 'pong',
    };
  }

  @Get('/dashboard/count')
  async getUserCount(): Promise<Response> {
    const userCount = this.appService.getUsersCount();
    return {
      data: userCount,
    };
  }

  @Get('/dashboard/book-count')
  async getBookCount(): Promise<Response> {
    return {
      data: await this.appService.getBooksCount(),
    };
  }

  @Get('/dashboard/record-count')
  async getRecordCount(): Promise<Response> {
    return {
      data: await this.appService.getRecordCount(),
    };
  }

  @UseGuards(ThrottlerGuard)
  @Get('/genre')
  async getGenre(): Promise<Response> {
    return {
      data: await this.appService.getGenre(),
    };
  }
}
