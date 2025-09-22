import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';

@Module({
  providers: [OrderItemService],
  controllers: [OrderItemController]
})
export class OrderItemModule {}
