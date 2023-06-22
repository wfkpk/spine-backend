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
    return user;
  }

  async getUser(userId: string) {
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
}
