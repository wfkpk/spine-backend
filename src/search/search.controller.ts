import { SearchService } from './search.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') q: string) {
    return await this.searchService.search(q);
  }
}
