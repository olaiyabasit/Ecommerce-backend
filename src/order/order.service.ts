import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { user: true, items: true },
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        total: 0,
        status: createOrderDto.status ?? 'PENDING',
      },
      include: { user: true, items: true },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { user: true, items: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { user: true, items: true },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: { user: true, items: true },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
