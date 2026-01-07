import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cart: CartService,
  ) {}
  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { user: true, items: true },
    });
  }

  /* 
  🧩 What a “Transaction” Does in Databases (and Prisma)

A transaction is a group of database operations that must all succeed or all fail together.
It’s like saying:

“Either everything in this block happens successfully — or nothing happens at all.”

This ensures data consistency and integrity.
  
  */

  async create(createOrderDto: CreateOrderDto): Promise<Order | null> {
    const userId = createOrderDto.userId;
    //Get user cart with all current items
    const cartObj = await this.cart.getCart(userId);
    if (!cartObj || !cartObj.items || cartObj.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      //Create order
      const order = await tx.order.create({
        data: {
          userId: createOrderDto.userId,
          total: cartObj.total,
          status: createOrderDto.status ?? 'PENDING',
        },
        include: { user: true, items: true },
      });

      //Create OderItems based on the CartItems
      const orderItems = cartObj.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));
      await tx.orderItem.createMany({
        data: orderItems,
      });
      await this.cart.clearCart(userId);

      return tx.order.findUnique({
        where: { id: order.id },
        include: { user: true, items: { include: { product: true } } },
      });
    });

    return result;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { user: true, items: { include: { product: true } } },
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
