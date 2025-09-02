import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // Create a new category
  create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data, // ✅ must be wrapped like this
    });
  }

  // Get all categories
  findAll() {
    return this.prisma.category.findMany({
      include: { products: true }, // ✅ fetch products with each category
    });
  }

  // Get a single category by ID
  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  // Update a category
  update(id: number, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data, // ✅ required
    });
  }

  // Delete a category
  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}

