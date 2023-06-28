import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getUsersCount() {
    return await this.prisma.user.count();
  }

  async getBooksCount() {
    return await this.prisma.book.count();
  }

  async getRecordCount() {
    return await this.prisma.record.count();
  }
  async getGenre() {
    return await this.prisma.genre.findMany();
  }
}
