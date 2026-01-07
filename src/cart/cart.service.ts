import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
  ) {}
  //Ensure the cart exists
  private async ensureCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }
    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    return { ...cart, total };
  }

  async addItem(userId: number, dto: CreateCartItemDto) {
    //Does the user already have a cart in existence
    const cart = await this.ensureCart(userId);
    //does product exist
    const product = await this.productService.findOne(dto.productId);
    if (!product) throw new NotFoundException('Product does not exist');
    if (dto.quantity > product.stock) {
      throw new BadRequestException('Not enough stock available');
    }
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });
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
    //Does the cart exist first
    const cart = await this.ensureCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });
    if (!item || item.cartId !== cart.id)
      throw new NotFoundException('Item not found');
    if (dto.quantity > item.product.stock) {
      throw new BadRequestException('Not enough stock available');
    }
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.ensureCart(userId);
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { product: true },
    });
    if (!item || item.cartId !== cart.id)
      throw new NotFoundException('Not cart item');
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(userId: number) {
    const cart = await this.ensureCart(userId);
    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
