import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProductController],   // ✅ Controllers only
  providers: [ProductService, PrismaService], // ✅ Providers (services)
  exports: [ProductService],          // ✅ Export if you’ll use it elsewhere
})
export class ProductModule {}

