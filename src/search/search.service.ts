import { Injectable } from '@nestjs/common';
import axios from 'axios';
import MeiliSearch from 'meilisearch';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class SearchService {
  private _client: MeiliSearch;

  constructor(private readonly prisma: PrismaService) {
    this._client = new MeiliSearch({
      host: 'http://localhost:7700/',
      apiKey: 'RQ6rUADUtL3Fs9yIQxG3MxCfkz3gSnysHyNXGSaG6Pg',
    });
  }

  async search(query: string) {
    const index = await this._client.getIndex('books');
    const search = await index.search(query, {
      limit: 2,
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
