import { BadRequestException, Injectable } from '@nestjs/common';
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
    if (query.length < 3) {
      throw new BadRequestException();
    }
    const apiUrl = `https://www.goodreads.com/book/auto_complete?format=json&q=${encodeURIComponent(
      query,
    )}`;

    let author;
    let documents;
    console.log(apiUrl);
    try {
      const response = await axios.get(apiUrl);
      const booksData = response.data;

      if (booksData.length === 0) {
        return [];
      }

      const books = booksData.map(async (bookData) => {
        if (!bookData.author || !bookData.bookId || !bookData.title) {
          throw new Error('Invalid book data received from the API');
        }
        const image_url_parts = bookData.imageUrl.split('.');
        const image_url = image_url_parts.slice(0, -2).join('.') + '.jpg';

        let upsertRetried = false;
        while (true) {
          try {
            author = await this.prisma.author.upsert({
              where: { goodReadsId: bookData.author.id },
              update: {},
              create: {
                goodReadsId: bookData.author.id,
                name: bookData.author.name,
                profileUrl: bookData.author.profileUrl,
              },
            });
            break;
          } catch (error) {
            if (error.code === 'P2002' && !upsertRetried) {
              // Unique constraint violation occurred, retry the upsert operation
              console.log('error');
              upsertRetried = true;
              continue;
            } else {
              // Handle other errors or throw the error to be caught by the caller
              console.error('Error upserting author:', error);
              throw error;
            }
          }
        }

        return {
          goodReadsId: bookData.bookId.toString(),
          title: bookData.title,
          description: bookData.description?.html || null,
          imageUrl: image_url,
          bookUrl: `https://www.goodreads.com${bookData.bookUrl}`,
          bookTitleBare: bookData.bookTitleBare,
          numPages: bookData.numPages || null,
          avgRating: bookData.avgRating.toString(),
          ratingsCount: bookData.ratingsCount,
          kcrPreviewUrl: bookData.kcrPreviewUrl || null,
          authorId: author.id,
        };
      });

      const createdBooks = await Promise.all(books);
      console.log(createdBooks);
      const booksForIndex = await this.prisma.book.createMany({
        data: createdBooks,
        skipDuplicates: true,
      });

      console.log(booksForIndex);
      documents = createdBooks.map((book) => {
        return {
          id: book.goodReadsId,
          title: book.title,
          description: book.description,
          imageUrl: book.imageUrl,
          bookUrl: book.bookUrl,
          bookTitleBare: book.bookTitleBare,
          numPages: book.numPages,
          avgRating: book.avgRating,
          ratingsCount: book.ratingsCount,
          author: author.authorId,
          authorName: author.name,
        };
      });
      console.log(documents);
      if (booksForIndex.count != 0) {
        const index = await this._client.index('ts-books');

        const res = await index.addDocuments(documents);
        console.log(res);
      }
    } catch (error) {
      console.error('Error calling the API:', error);
      throw error;
    }

    return documents;
  }

  async fun(query: string) {
    const index = await this._client.getIndex('ts-books');
    const search = await index.search(query, {
      limit: 2,
      attributesToHighlight: ['title', 'description', 'authorName'],
      sort: ['ratingsCount:desc'], // Sort by average rating in descending order
    });

    return search;
  }
}
