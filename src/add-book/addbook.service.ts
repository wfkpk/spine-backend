import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateAuthorDto } from './dto/create-author.dto';
@Injectable()
export class AddBookService {
  constructor(private readonly prisma: PrismaService) {}

  async addBookToDatabase(createBookDto: CreateBookDto) {
    const book = await this.prisma.book.findUnique({
      where: {
        goodReadsId: createBookDto.goodReadsId,
      },
    });
    if (book) {
      console.log('Book already exists in database');
      return;
    }
    const addBook = await this.prisma.book.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        imageUrl: createBookDto.imageUrl,
        bookUrl: createBookDto.bookUrl,
        bookTitleBare: createBookDto.bookTitleBare,
        numPages: createBookDto.numPages,
        avgRating: createBookDto.avgRating,
        ratingsCount: createBookDto.ratingsCount,
        kcrPreviewUrl: createBookDto.kcrPreviewUrl,
        goodReadsId: createBookDto.goodReadsId,
        authorId: createBookDto.authorId,
      },
    });
    console.log(addBook);
  }

  async addAuthorToDatabase(createAuthorDto: CreateAuthorDto) {
    const author = await this.prisma.author.findUnique({
      where: {
        goodReadsId: createAuthorDto.gooReadsId,
      },
    });
    if (author) {
      console.log('Author already exists in database');
      return;
    }
    const addAuthor = await this.prisma.author.create({
      data: {
        name: createAuthorDto.name,
        profileUrl: createAuthorDto.profileUrl,
        goodReadsId: createAuthorDto.gooReadsId,
      },
    });
    console.log(addAuthor);
  }
}
