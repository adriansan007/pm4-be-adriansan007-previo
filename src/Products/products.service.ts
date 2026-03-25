import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { Product } from './product.entity';
import { CategoriesService } from '../Categories/categories.service';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  /** Obtener todos los productos */
  async getProducts(): Promise<Product[]> {
    try {
      return await this.productsRepository.getProducts();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      throw new InternalServerErrorException(
        'No se pudieron obtener los productos',
      );
    }
  }

  /** Obtener un producto por ID (ACTIVIDAD 04) */
  async getProductById(id: string): Promise<Product> {
    try {
      const product = await this.productsRepository.getProductById(id);

      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return product;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Error) {
        this.logger.error(error.message);
      }

      throw new InternalServerErrorException('No se pudo obtener el producto');
    }
  }

  /** Crear un producto */
  async addProduct(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const { categoryId, ...rest } = createProductDto;

      if (!categoryId) {
        throw new BadRequestException('El producto debe tener una categoría');
      }

      const categories = await this.categoriesService.getCategories();
      const category = categories.find((cat) => cat.id === categoryId);

      if (!category) {
        throw new NotFoundException(
          `Categoría con ID ${categoryId} no encontrada`,
        );
      }

      const product: Partial<Product> = {
        ...rest,
        category,
      };

      return await this.productsRepository.addProduct(product);
    } catch (error: unknown) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error instanceof Error) {
        this.logger.error(error.message);
      }

      throw new InternalServerErrorException('No se pudo crear el producto');
    }
  }

  /** Agregar varios productos (seeder) */
  async addProducts(products: Partial<Product>[]): Promise<Product[]> {
    try {
      return await this.productsRepository.addProducts(products);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.message);
      }
      throw new InternalServerErrorException(
        'No se pudieron agregar los productos',
      );
    }
  }

  /** Seeder para inicializar productos */
  async seedProducts(): Promise<Product[]> {
    try {
      const categories = await this.categoriesService.getCategories();

      if (!categories.length) {
        throw new BadRequestException('No hay categorías disponibles');
      }

      const productsData: Partial<Product>[] = [
        {
          name: 'Smartphone',
          description: 'Teléfono inteligente',
          price: 500,
          stock: 10,
          category: categories[0],
        },
        {
          name: 'Laptop',
          description: 'Computadora portátil',
          price: 1000,
          stock: 5,
          category: categories[0],
        },
        {
          name: 'Remera',
          description: 'Camiseta de algodón',
          price: 20,
          stock: 50,
          category: categories[1],
        },
        {
          name: 'Silla',
          description: 'Silla de oficina',
          price: 100,
          stock: 15,
          category: categories[2],
        },
        {
          name: 'Libro de JavaScript',
          description: 'Aprende JS',
          price: 30,
          stock: 25,
          category: categories[4],
        },
      ];

      return await this.addProducts(productsData);
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof Error) {
        this.logger.error(error.message);
      }

      throw new InternalServerErrorException(
        'No se pudieron inicializar los productos',
      );
    }
  }

  /** Actualizar la imagen de un producto (ACTIVIDAD 04) */
  async updateProductImage(id: string, imgUrl: string): Promise<Product> {
    try {
      const product = await this.getProductById(id);

      product.imgUrl = imgUrl;

      return await this.productsRepository.saveProduct(product);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Error) {
        this.logger.error(error.message);
      }

      throw new InternalServerErrorException(
        'No se pudo actualizar la imagen del producto',
      );
    }
  }
}
