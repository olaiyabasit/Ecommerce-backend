import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [OrderItemService],
  imports: [PrismaModule],
  controllers: [OrderItemController]
})
export class OrderItemModule {}
