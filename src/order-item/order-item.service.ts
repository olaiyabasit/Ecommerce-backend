import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ProductService } from 'src/product/product.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class OrderItemService {
  constructor(
    private prisma: PrismaService,
    private product: ProductService,
    private order: OrderService,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    // if its an order item veryfity the order and product exist

    const product = await this.product.findOne(createOrderItemDto.productId);
    const order = await this.order.findOne(createOrderItemDto.orderId);
    if (!order || !product)
      throw new NotFoundException('Order or Product not found');
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
    const item = this.prisma.orderItem.findUnique({
      where: { id },
      include: { order: true, product: true },
    });
    if (!item) throw new NotFoundException('Order Item does not Exist');
    return item;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const item = await this.prisma.orderItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Order Item does not Exist');

    return this.prisma.orderItem.update({
      where: { id },
      data: updateOrderItemDto,
      include: { order: true, product: true },
    });
  }

  async remove(id: number) {
    const item = await this.prisma.orderItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Order Item does not Exist');
    return this.prisma.orderItem.delete({
      where: { id },
    });
  }
}
