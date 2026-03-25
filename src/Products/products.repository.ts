import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /** Obtener todos los productos con su categoría */
  async getProducts(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['category'],
    });
  }

  /** Obtener un producto por ID (ACTIVIDAD 04) */
  async getProductById(id: string): Promise<Product | null> {
    return this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  /** Guardar UN producto */
  async addProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(productData);
    return this.productRepo.save(product);
  }

  /** Guardar VARIOS productos (seeder) */
  async addProducts(products: Partial<Product>[]): Promise<Product[]> {
    const entities = products.map((prod) => this.productRepo.create(prod),
    );
    return this.productRepo.save(entities);
  }

  /** Buscar productos por IDs */
  async findByIds(ids: string[]): Promise<Product[]> {
    return this.productRepo.find({
      where: { id: In(ids) },
      relations: ['category'],
    });
  }

  /** Guardar cambios de un producto existente (ACTIVIDAD 04) */
  async saveProduct(product: Product): Promise<Product> {
    return this.productRepo.save(product);
  }
}
