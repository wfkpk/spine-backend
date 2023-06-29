import { EditRequestDto } from './dto/edit-request.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseAuthStrategy } from 'src/auth/firebase-auth.strategy';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseAuthStrategy,
  ) {}

  async createUser(createUserDto: CreateUserDto, authToken: string) {
    const firebaseUser = await this.firebase.validate(authToken);

    const firebaseUid = firebaseUser.uid;
    const firebaseEmail = firebaseUser.email;
    const mailVerified = firebaseUser.email_verified;

    const alreadyUser = await this.prisma.user.findUnique({
      where: {
        email: firebaseEmail as string,
      },
    });

    if (alreadyUser) {
      throw new BadRequestException('user already exists');
    }
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        bio: createUserDto.bio,
        firebaseUid: firebaseUid,
        email: firebaseEmail,
        mailVerified: mailVerified,
      },
    });

    await this.prisma.karma.create({
      data: {
        userId: user.id,
      },
    });
    return user;
  }

  async getUser(userId: string) {
    this._updateKarma(userId);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        email: true,
        mailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            Record: true,
            comment: true,
            Notes: true,
          },
        },
        karma: {
          select: {
            id: true,
            karma: true,
          },
        },
      },
    });

    return user;
  }

  async updateUser(updateUserDto: any, userId: string) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: updateUserDto.name,
        bio: updateUserDto.bio,
      },
    });
    return user;
  }

  async getNotes(userId: string) {
    const notes = await this.prisma.notes.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        book: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });
    return notes;
  }

  async bookEditRequest(editRequestDto: EditRequestDto, userId: string) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: editRequestDto.bookId,
      },
    });
    if (!book) {
      throw new BadRequestException('book not found');
    }
    const description = Buffer.from(editRequestDto.bookDescription, 'utf-8');

    const bookEditRequest = await this.prisma.editRequest.create({
      data: {
        bookName: editRequestDto.bookName || book.title,
        bookDescription: description,
        authorName: editRequestDto.authorName,
        genre: {
          connect: editRequestDto.genre.map((genre) => ({
            id: genre,
          })),
        },
        bookId: book.id,
        userId: userId,
      },
    });
    return bookEditRequest;
  }

  //every read has 20 karma points
  //every comment has 20 karma points
  //every note has 5 karma point
  //every edit request approval has 100 karma point
  //every edit request rejection and pending has 50 karma point
  //every want to read has 5 karma point
  //every currently reading has 10 karma point

  async _updateKarma(userId: string): Promise<number> {
    let karma = 0;

    const recordBooks = await this.prisma.record.findMany({
      where: {
        userId: userId,
      },
      select: {
        status: true,
      },
    });
    //map to iterate through the recordbooks and count karma
    let readCount = 0,
      currentlyReadingCount = 0,
      wantToReadCount = 0;
    recordBooks.map((recordBook) => {
      if (recordBook.status == 'READ') {
        readCount++;
      } else if (recordBook.status == 'CURRENTLY_READING') {
        currentlyReadingCount++;
      } else {
        wantToReadCount++;
      }
    });

    karma = readCount * 20 + currentlyReadingCount * 10 + wantToReadCount * 5;

    const notesCount = await this.prisma.notes.count({
      where: {
        userId: userId,
      },
    });

    karma = karma + notesCount * 5;

    const commentCount = await this.prisma.comment.count({
      where: {
        id: userId,
      },
    });

    karma = karma + commentCount * 50;

    const editRequests = await this.prisma.editRequest.findMany({
      where: {
        userId: userId,
      },
      select: {
        status: true,
      },
    });

    let editApproved = 0,
      editPending = 0;
    editRequests.map((editRequest) => {
      if (editRequest.status == 'APPROVED') {
        editApproved++;
      } else {
        editPending++;
      }
    });

    karma += editApproved * 100 + editPending * 50;
    const karmaBefore = await this.prisma.karma.findUnique({
      where: {
        userId: userId,
      },
    });
    if (karma != karmaBefore.karma) {
      const karmaUpdate = await this.prisma.karma.update({
        where: {
          userId,
        },
        data: {
          karma: karma,
        },
        select: {
          karma: true,
        },
      });
      return karmaUpdate.karma;
    }
    return karma;
  }
}
