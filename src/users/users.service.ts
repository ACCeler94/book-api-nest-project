import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public getAllUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  public getUserById(id: User['id']): Promise<User> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  public getUserByEmail(email: User['email']): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  public async createUser(userData: User, password) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...userData,
          password: {
            create: {
              hashedPassword: password,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Email is already used');
    }
  }

  public async editUser(
    id: User['id'],
    userData: Omit<User, 'password'>,
    password: string | undefined,
  ) {
    if (password) {
      return await this.prismaService.user.update({
        where: { id },
        data: {
          ...userData,
          password: {
            update: {
              hashedPassword: password,
            },
          },
        },
      });
    } else {
      return await this.prismaService.user.update({
        where: { id },
        data: userData,
      });
    }
  }

  public deleteUserById(id: User['id']): Promise<User> {
    return this.prismaService.user.delete({ where: { id } });
  }
}
