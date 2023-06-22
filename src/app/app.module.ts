import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from 'src/books/books.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, PrismaModule, BooksModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
