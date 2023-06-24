import { SearchService } from './search.service';
import { Controller, Get, Query } from '@nestjs/common';
import { Response } from 'src/interface/response';
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string): Promise<Response> {
    return {
      data: await this.searchService.searchAndSaveBooks(q),
    };
  }
}
