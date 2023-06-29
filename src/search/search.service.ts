import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import MeiliSearch from 'meilisearch';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class SearchService {
  private _client: MeiliSearch;

  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {
    this._client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY,
    });
  }

  async search(query: string) {
    const index = await this._client.getIndex('books');
    const search = await index.search(query, {
      limit: 2,
      attributesToHighlight: ['title', 'auth'],
    });

    return search;
  }

  async searchAndSaveBooks(query: string) {
    if (query.length < 3) {
      throw new BadRequestException();
    }
    const apiUrl = `https://www.goodreads.com/book/auto_complete?format=json&q=${encodeURIComponent(
      query,
    )}`;

    let author;
    let documents;
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
        let cdnImageUrl;
        const bookUnique = await this.prisma.book.findUnique({
          where: { goodReadsId: bookData.bookId.toString() },
        });
        if (!bookUnique) {
          try {
            cdnImageUrl = await this.uploadService.uploadFileFromUrl(image_url);
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        }
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
          description: null,
          imageUrl: cdnImageUrl || null,
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
      const booksForIndex = await this.prisma.book.createMany({
        data: createdBooks,
        skipDuplicates: true,
      });

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
      if (booksForIndex.count != 0) {
        const index = await this._client.index('books');
        await index.addDocuments(documents);
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

  // //delete all documents in index books
  // async deleteDocument() {
  //   const index = await this._client.getIndex('books');
  //   const res = await index.deleteAllDocuments();
  // }
}
