import { CreateNotesDto } from './dto/create-notes.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BooksService } from './books.service';
import {
  Controller,
  Get,
  Request,
  Param,
  Post,
  UseGuards,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { Response } from 'src/interface/response';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { CreateStatusDto } from './dto/create-status.dto';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('books/:id')
  @ApiOperation({ summary: 'Get Book by Id' })
  @ApiResponse({ status: 200, description: 'Get book successful.' })
  async getBookById(@Param('id') bookId: string): Promise<Response> {
    const book = await this.booksService.getBookById(bookId);
    return {
      data: book,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get('books/current')
  @ApiOperation({ summary: 'Get Current Reading List of all books' })
  @ApiResponse({ status: 200, description: 'Get all books successful.' })
  async getReadingList(@Request() req: any): Promise<Response> {
    const userId = req.headers['userId'];

    const books = await this.booksService.getCurrentlyReadingBooks(userId);
    return {
      data: books,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get('books/want-to')
  @ApiOperation({ summary: 'Get Want to Read List of all books' })
  @ApiResponse({ status: 200, description: 'Get all books successful.' })
  async getWantToReadList(@Request() req: any): Promise<Response> {
    const userId = req.headers['userId'];

    const books = await this.booksService.getWantToReadBooks(userId);
    return {
      data: books,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get('books/read')
  @ApiOperation({ summary: 'Get Read List of all books' })
  @ApiResponse({ status: 200, description: 'Get all books successful.' })
  async getReadList(@Request() req: any): Promise<Response> {
    const userId = req.headers['userId'];
    const books = await this.booksService.getReadBooks(userId);
    return {
      data: books,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Patch('books/:id/record/update')
  @ApiOperation({ summary: 'Update Status of the Book' })
  @ApiResponse({ status: 200, description: 'Update status successful.' })
  async updateStatus(
    @Param('id') bookId: string,
    @Request() req: any,
    createStatusDto: CreateStatusDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    const status = await this.booksService.updateStatus(
      bookId,
      userId,
      createStatusDto,
    );
    return {
      data: status,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Post('books/:id/record/add')
  @ApiOperation({ summary: 'Add Book to my record' })
  @ApiResponse({ status: 200, description: 'Add book successful.' })
  async addBookToMyRecord(
    @Param('id') bookId: string,
    @Request() req: any,
    createStatusDto: CreateStatusDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    const book = await this.booksService.addBookToMyRecord(
      bookId,
      userId,
      createStatusDto,
    );
    return {
      data: book,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Delete('books/:id/record/delete')
  @ApiOperation({ summary: 'Delete Book from my record' })
  @ApiResponse({ status: 200, description: 'Delete book successful.' })
  async deleteBookFromMyRecord(
    @Param('id') bookId: string,
    @Request() req: any,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    const book = await this.booksService.deleteBookFromMyRecord(bookId, userId);
    return {
      data: book,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Post('books/:id/comment')
  @ApiOperation({ summary: 'Post Comment on the Book' })
  @ApiResponse({ status: 200, description: 'Post comment successful.' })
  async postComment(
    @Param('id') bookId: string,
    @Request() req: any,
    createCommentDto: CreateCommentDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    const comment = await this.booksService.postComment(
      bookId,
      userId,
      createCommentDto,
    );
    return {
      data: comment,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Delete('books/:id/delete/:commentId')
  @ApiOperation({ summary: 'Delete comment from the post' })
  @ApiResponse({ status: 200, description: 'Delete comment successful.' })
  async deleteComment(
    @Param('id') bookId: string,
    @Param('commentId') commentId: string,
    @Request() req: any,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    const comment = await this.booksService.deleteComment(
      bookId,
      commentId,
      userId,
    );
    return {
      data: comment,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get('books/timeline')
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination',
    type: 'string',
  })
  @ApiOperation({ summary: 'Get timeline' })
  @ApiResponse({})
  async getReadingTimeline(
    @Query('cursor') cursor: string,
    @Request() req: any,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    const timeline = await this.booksService.getReadingTimeline(userId, cursor);
    return {
      data: timeline,
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Post('books/:id/notes')
  @ApiOperation({ summary: 'Post Notes on the Book' })
  @ApiResponse({ status: 200, description: 'Post notes successful.' })
  async postNotes(
    @Param('id') bookId: string,
    @Request() req: any,
    createNotesDto: CreateNotesDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    const notes = await this.booksService.postNotes(
      bookId,
      userId,
      createNotesDto,
    );
    return {
      data: notes,
    };
  }
}
