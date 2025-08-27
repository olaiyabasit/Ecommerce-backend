import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    create(data: Prisma.CategoryCreateInput) {
        return this.prisma.category.create({ data });
    }

    findAll() {
        return this.prisma.category.findMany({
            include: {products: true },
        });
    }

    findOne(id: number) {
        return this.prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });
    }

    update(id: number, data: Prisma.CategoryUpdateInput) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.category.delete({
            where: { id },
        });
    }
}
