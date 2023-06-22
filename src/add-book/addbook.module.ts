import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AddBookController } from './addbook.controller';
import { AddBookService } from './addbook.service';

@Module({
  imports: [PrismaModule],
  controllers: [AddBookController],
  providers: [AddBookService],
})
export class AddBookModule {}
