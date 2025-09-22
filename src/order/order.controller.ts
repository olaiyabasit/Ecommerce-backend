import { Controller, Get, Post, Body, Param, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Roles('CUSTOMER')
    @Post()
    create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.orderService.create({...createOrderDto,
            userId: req.user.id,
        });
    }

    @Roles('CUSTOMER', 'ADMIN')
    @Get()
    findAll(@Request() req) {
        if (req.user.role === 'ADMIN') {
         return this.orderService.findAll();
        }

        return this.orderService.findByUser(req.user.id)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderService.findOne(+id);
    }

    @Roles('ADMIN')
    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.orderService.update(+id, updateOrderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderService.remove(+id);
    }
}
