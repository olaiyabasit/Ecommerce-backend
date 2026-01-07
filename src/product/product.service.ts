import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Create a new product
  async create(data: Prisma.ProductCreateInput) {
    try {
      return await this.prisma.product.create({
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        console.log(error.code);
        throw new NotFoundException('Product Alredy Exists');
      }
      throw new InternalServerErrorException('Failed to Create a Product');
    }
  }

  // Get all products
  async findAll() {
    try {
      return await this.prisma.product.findMany({
        include: { category: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        console.log(error.code);
        throw new NotFoundException('Unable to find Products');
      }
      throw new InternalServerErrorException(
        'An errror Occured Unable to fetch products',
      );
    }
  }

  // Get a single product by ID
  async findOne(id: number) {
    try {
      return await this.prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        console.log(error.code);
        throw new NotFoundException('Product does not exist');
      }
      throw new InternalServerErrorException('Failed to Find product');
    }
  }

  // Update a product
  async update(id: number, data: Prisma.ProductUpdateInput) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        console.log(error.code);
        throw new NotFoundException('Product does not exist');
      }
      throw new InternalServerErrorException('Failed to Update  product');
    }
  }

  // Delete a product
  async remove(id: number): Promise<Product> {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Product does not exist');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Cannot delete category because it has related cetegories',
        );
      }
      throw new InternalServerErrorException('Failed to delte product');
    }
  }
}
