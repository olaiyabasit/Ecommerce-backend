import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    private async ensureCart(userId: number) {
        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId } });
        }
        return cart;
    }

    async getCart(userId: number) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
    }

    async addItem(userId: number, dto: CreateCartItemDto) {
        const cart = await this.ensureCart(userId);

        const existing = await this.prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: dto.productId }, });
        if (existing) {
            return this.prisma.cartItem.update({ 
                where: { id: existing.id },
                data: { quantity: existing.quantity + dto.quantity }, 
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: dto.productId,
                quantity: dto.quantity,
            },
        });
    }

    async updateItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
        const item = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
        if (!item) throw new NotFoundException('Item not found');
    }

    async removeItem(userId: number, itemId: number) {
        const cart = await this.ensureCart(userId);
        const item = await this.prisma.CartItem.findUnique({ where: { id: itemId } });
        if (!item || item.cartId !== cart.id)
            throw new NotFoundException('Not cart item');
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }

    async clearCart(userId: number) {
        const cart = await this.ensureCart(userId);
        return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}
