import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PrismaModule]
})
export class OrderModule {}
