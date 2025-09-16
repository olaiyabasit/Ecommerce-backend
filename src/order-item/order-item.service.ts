import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
    constructor(private prisma: PrismaService) {}

    async create(createOrderItemDto: CreateOrderItemDto) {
        return this.prisma.orderItem.create({
            data: {
                orderId: createOrderItemDto.orderId,
                productId: createOrderItemDto.productId,
                quantity: createOrderItemDto.quantity,
                price: createOrderItemDto.price,
            },
            include: { order: true, product: true },
        });
    }

    async findAll() {
        return this.prisma.orderItem.findMany({
            include: { order: true, product: true },
        });
    }

    async findOne(id: number) {
        return this.prisma.orderItem.findUnique({
            where: { id },
            include: { order: true, product: true },
        });
    }

    async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
        return this.prisma.orderItem.update({
            where: { id },
            data: updateOrderItemDto,
            include: { order: true, product: true },
        });
    }

    async remove(id: number) {
        return this.prisma.orderItem.delete({
            where: { id },
        });
    }
}
