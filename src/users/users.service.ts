// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/auth/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(CreateUserDto.password, 10);
    const roleName = CreateUserDto.email.endsWith('@admin.com')
      ? Role.ADMIN
      : Role.CUSTOMER;
    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new Error('Role not found');
    }
    return this.prisma.user.create({
      data: {
        email: CreateUserDto.email,
        password: hashedPassword,
        role: { connect: { id: role.id } },
        name: CreateUserDto?.name,
      },
      include: { role: true },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
