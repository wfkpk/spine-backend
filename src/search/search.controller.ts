import { SearchService } from './search.service';
import { Controller, Get, Query } from '@nestjs/common';
import { Response } from 'src/interface/response';
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string): Promise<Response> {
    const res = await this.searchService.searchAndSaveBooks(q);
    return {
      data: res,
    };
  }

  @Get('/elevate')
  async fun(@Query('q') q: string) {
    console.log(q);
    return {
      data: await this.searchService.search(q),
    };
  }
}
