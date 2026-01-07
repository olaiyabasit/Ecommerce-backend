import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [OrderItemService],
  imports: [PrismaModule, ProductModule, OrderModule],
  controllers: [OrderItemController],
})
export class OrderItemModule {}
