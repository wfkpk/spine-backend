import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from 'src/books/books.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/user/user.module';
import { UploadModule } from 'src/upload/upload.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    //for rate limiting
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 5,
    // }),
    UserModule,
    PrismaModule,
    BooksModule,
    SearchModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
