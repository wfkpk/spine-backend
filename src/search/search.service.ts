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

  // async search(query: string) {
  //   const index = await this._client.getIndex('books');
  //   const search = await index.search(query, {
  //     limit: 2,
  //     attributesToHighlight: ['title', 'description'],
  //   });

  //   return search;
  // }

  async addDocuments() {
    const index = await this._client.index('books');
    const documents = [];
    const response = await index.addDocuments(documents);
    console.log(response);
    return response;
  }

  // async search(query) {
  //   const apiUrl = `https://www.goodreads.com/book/auto_complete?format=json&q=${encodeURIComponent(
  //     query,
  //   )}`;

  //   try {
  //     const response = await axios.get(apiUrl);
  //     const booksData = response.data;

  //     await this.saveBooksDataIn(booksData);

  //     return booksData;
  //   } catch (error) {
  //     console.error('Error calling the API:', error);
  //     throw error;
  //   }
  // }
  // async saveBooksDataIn(data) {
  //   const books = data.map((bookData) => {
  //     const image_url_parts = bookData.imageUrl.split('.');
  //     const image_url = image_url_parts.slice(0, -2).join('.') + '.jpg';

  //     return {
  //       id: bookData.bookId,
  //       title: bookData.title,
  //       description: bookData.description?.html || null,
  //       imageUrl: image_url,
  //       bookUrl: `https://www.goodreads.com${bookData.bookUrl}`,
  //       bookTitleBare: bookData.bookTitleBare,
  //       numPages: bookData.numPages || null,
  //       avgRating: bookData.avgRating,
  //       ratingsCount: bookData.ratingsCount,
  //       kcrPreviewUrl: bookData.kcrPreviewUrl || null,
  //       goodReadsId: bookData.bookId,
  //       author: {
  //         connectOrCreate: {
  //           where: { id: bookData.author.id },
  //           create: {
  //             id: bookData.author.id,
  //             name: bookData.author.name,
  //             isGoodreadsAuthor: bookData.author.isGoodreadsAuthor,
  //             profileUrl: bookData.author.profileUrl,
  //             worksListUrl: bookData.author.worksListUrl,
  //           },
  //         },
  //       },
  //     };
  //   });

  //   await this.prisma.book.createMany({ data: books, skipDuplicates: true });
  // }
  async searchAndSaveBooks(query: string) {
    const apiUrl = `https://www.goodreads.com/book/auto_complete?format=json&q=${encodeURIComponent(
      query,
    )}`;

    let books;
    console.log(apiUrl);
    try {
      const response = await axios.get(apiUrl);
      const booksData = response.data;

      books = booksData.map((bookData) => {
        const image_url_parts = bookData.imageUrl.split('.');
        const image_url = image_url_parts.slice(0, -2).join('.') + '.jpg';

        return {
          goodReadsId: bookData.bookId,
          title: bookData.title,
          description: bookData.description?.html || null,
          imageUrl: image_url,
          bookUrl: `https://www.goodreads.com${bookData.bookUrl}`,
          bookTitleBare: bookData.bookTitleBare,
          numPages: bookData.numPages || null,
          avgRating: bookData.avgRating,
          ratingsCount: bookData.ratingsCount,
          kcrPreviewUrl: bookData.kcrPreviewUrl || null,
          author: {
            connectOrCreate: {
              where: { id: bookData.author.id },
              create: {
                goodReadsId: bookData.author.id,
                name: bookData.author.name,
                isGoodreadsAuthor: bookData.author.isGoodreadsAuthor,
                profileUrl: bookData.author.profileUrl,
              },
            },
          },
        };
      });
      console.log(books.author.goodReadsId);
      //   await this.prisma.book.createMany({
      //     data: books,
      //     skipDuplicates: true,
      //   });
      //   const index = await this._client.index('books');
      //   const res = await index.addDocuments(booksData);
      //   console.log(res);
    } catch (error) {
      console.error('Error calling the API:', error);
      throw error;
    }
    return books;
  }
}
