import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  /** Obtener todas las categorías */
  async getCategories(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  /** Agregar múltiples categorías evitando duplicados */
  async addCategories(categories: Partial<Category>[]): Promise<Category[]> {
    const inserted: Category[] = [];

    for (const cat of categories) {
      const exists = await this.categoryRepo.findOne({
        where: { name: cat.name },
      });
      if (!exists) {
        const saved = await this.categoryRepo.save(cat);
        inserted.push(saved);
      }
    }

    return inserted;
  }
}
