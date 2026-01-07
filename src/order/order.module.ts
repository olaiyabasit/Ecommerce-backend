import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  exports: [OrderService],
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PrismaModule, CartModule],
})
export class OrderModule {}
