import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Prisma } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() data: Prisma.CategoryCreateInput) {
    return this.categoryService.create(data);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.CategoryUpdateInput) {
    return this.categoryService.update(+id, data);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
