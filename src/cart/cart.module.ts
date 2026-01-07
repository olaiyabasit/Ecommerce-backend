import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [CartService],
  exports: [CartService],
  controllers: [CartController],
  imports: [PrismaModule, forwardRef(() => ProductModule)],
})
export class CartModule {}
