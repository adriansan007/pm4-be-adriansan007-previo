import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  Logger,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { RolesGuard } from '../Auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../roles.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  /** GET /products (NO protegido) */
  @Get()
  async getProducts(): Promise<Product[]> {
    try {
      return await this.productsService.getProducts();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      throw new InternalServerErrorException(
        'No se pudieron obtener los productos',
      );
    }
  }

  /** GET /products/:id (NO protegido) */
  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  /** POST /products (NO protegido) */
  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.addProduct(createProductDto);
  }

  /**
   * 🔒 PUT /products/:id
   * SOLO ADMIN — ACTIVIDAD 05
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateProductImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('imgUrl') imgUrl: string,
  ): Promise<Product> {
    return this.productsService.updateProductImage(id, imgUrl);
  }
}
