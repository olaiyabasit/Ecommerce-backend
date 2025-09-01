import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({
      data,
      include: { items: true, user: true },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: true, user: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });
  }

  async update(id: number, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({
       where: { id },
       include: { items: true, user: true },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
