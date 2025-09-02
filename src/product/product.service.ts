import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Create a new product
  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data, // ✅ fixed
    });
  }

  // Get all products
  findAll() {
    return this.prisma.product.findMany({
      include: { category: true }, // ✅ fetch category info with product
    });
  }

  // Get a single product by ID
  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  // Update a product
  update(id: number, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data, // ✅ fixed
    });
  }

  // Delete a product
  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}

