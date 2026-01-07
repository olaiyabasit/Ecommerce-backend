import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
  imports: [PrismaModule],
})
export class ProductModule {}
