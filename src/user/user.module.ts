import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseAuthStrategy } from 'src/auth/firebase-auth.strategy';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, FirebaseAuthStrategy],
})
export class UserModule {}
