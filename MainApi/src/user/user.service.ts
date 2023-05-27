import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public hideImportantFields(user: User): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return this.hideImportantFields(user);
  }

  async findByIdToReturn(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return this.hideImportantFields(user);
  }

  async findOne(email: string): Promise<Partial<User>> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
