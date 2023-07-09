import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}

@Injectable()
export class UserAuthGuard {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const firebaseUser = request.user;

    if (!firebaseUser) {
      return false;
    }
    const firebaseUid: string = firebaseUser.uid;
    const user = await this.prisma.user.findUnique({
      where: {
        firebaseUid: firebaseUid,
      },
    });
    if (user) {
      request.headers['userId'] = user.id;
    } else {
      const newUser = await this.prisma.user.create({
        data: {
          firebaseUid: firebaseUid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatar: firebaseUser?.photoURL,
        },
      });
      request.headers['userId'] = newUser.id;
      return true;
    }
    return true;
  }
}

@Injectable()
export class NotAuthGuard implements CanActivate {
  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
