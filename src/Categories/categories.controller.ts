import { Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiOkResponse({
    description: 'Lista de categorías obtenida correctamente',
    type: Category,
    isArray: true,
  })
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Post('seeder')
  @ApiOperation({ summary: 'Crear categorías iniciales (Seeder)' })
  @ApiCreatedResponse({
    description: 'Categorías creadas correctamente',
    type: Category,
    isArray: true,
  })
  async seedCategories(): Promise<Category[]> {
    return this.categoriesService.seedCategories();
  }
}
