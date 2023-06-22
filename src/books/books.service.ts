import { CreateNotesDto } from './dto/create-notes.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentlyReadingBooks(userId: string) {
    const books = await this.prisma.record.findMany({
      where: {
        userId: userId,
        status: 'READ',
      },
      select: {
        id: true,
        progress: true,
        createdAt: true,
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            imageUrl: true,
            numPages: true,
            avgRating: true,
            ratingsCount: true,
          },
        },
      },
    });
    return books;
  }

  async getReadBooks(userId: string) {
    const books = await this.prisma.record.findMany({
      where: {
        userId: userId,
        status: 'READ',
      },
      select: {
        id: true,
        progress: true,
        createdAt: true,
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            imageUrl: true,
            numPages: true,
            avgRating: true,
            ratingsCount: true,
          },
        },
      },
    });
    return books;
  }

  async getWantToReadBooks(userId: string) {
    const books = await this.prisma.record.findMany({
      where: {
        userId: userId,
        status: 'WANT_TO_READ',
      },
      select: {
        id: true,
        progress: true,
        createdAt: true,
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            imageUrl: true,
            numPages: true,
            avgRating: true,
            ratingsCount: true,
          },
        },
      },
    });
    return books;
  }

  async getBookById(bookId: string) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        imageUrl: true,
        numPages: true,
        avgRating: true,
        ratingsCount: true,
        _count: {
          select: {
            Record: true,
          },
        },
        comment: {
          select: {
            id: true,
            text: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return book;
  }

  async postComment(
    bookId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        book: {
          connect: {
            id: bookId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return comment;
  }

  async getReadingTimeline(userId: string, cursor: string) {
    const books = await this.prisma.record.findMany({
      where: {
        userId: userId,
        status: 'READ',
      },
      select: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            description: true,
            imageUrl: true,
            numPages: true,
            avgRating: true,
            ratingsCount: true,
          },
        },
      },
      ...(cursor
        ? {
            orderBy: [{ createdAt: 'desc' }],
          }
        : {}),
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
    return books;
  }

  async postNotes(
    bookId: string,
    userId: string,
    createNotesDto: CreateNotesDto,
  ) {
    const notes = await this.prisma.notes.create({
      data: {
        notes: createNotesDto.notes,
        book: {
          connect: {
            id: bookId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return notes;
  }

  async deleteComment(bookId: string, userId: string, commentId: string) {
    const commentCheck = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        bookId: bookId,
        userId: userId,
      },
    });
    if (!commentCheck) {
      throw new BadRequestException('Comment not found');
    }
    const comment = await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return comment;
  }
}
