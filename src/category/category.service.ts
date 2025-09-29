import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // Create a new category
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    try {
      return await this.prisma.category.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('An error Occured');
      }
      throw new InternalServerErrorException('Failed to fetch Catgories');
    }
  }

  // Get all categories
  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        include: { products: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('An error Occured');
      }
      throw new InternalServerErrorException('Failed to fetch Catgories');
    }
  }

  // Get a single category by ID
  async findOne(id: number) {
    try {
      return await this.prisma.category.findUnique({
        where: { id },
        include: { products: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category does not exist');
      }
      throw new InternalServerErrorException('Failed to find category');
    }
  }

  // Update a category
  async update(id: number, data: Prisma.CategoryUpdateInput) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category does not exist');
      }
      throw new InternalServerErrorException('Failed to update category');
    }
  }

  async remove(id: number): Promise<Category> {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Category does not exist');
      }
      throw new InternalServerErrorException('Failed to delete category');
    }
  }
}
