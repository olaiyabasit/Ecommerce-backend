import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProductController], // ✅ Controllers only
  providers: [ProductService, PrismaService], // ✅ Providers (services)
  imports: [PrismaModule], // ✅ Export if you’ll use it elsewhere
})
export class ProductModule {}
