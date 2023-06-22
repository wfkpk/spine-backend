import { Injectable } from '@nestjs/common';
import MeiliSearch from 'meilisearch';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class SearchService {
  private _client: MeiliSearch;

  constructor(private readonly prisma: PrismaService) {
    this._client = new MeiliSearch({
      host: 'http://localhost:7700/',
      apiKey: 'eGjtef_BM27_QsFrseXRFre9HQ1Y2SvDry7HKKzwVy0-WLX0LD-W0raQzs4',
    });
  }

  async search(query: string) {
    const index = await this._client.getIndex('books');
    const search = await index.search(query, {
      limit: 5,
      attributesToHighlight: ['title', 'description'],
    });

    return search;
  }

  async addDocuments() {
    const index = await this._client.index('books');
    const documents = [];
    const response = await index.addDocuments(documents);
    console.log(response);
    return response;
  }
}
