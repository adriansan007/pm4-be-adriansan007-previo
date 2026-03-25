import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getCategories(): Promise<Category[]> {
    return this.categoriesRepository.getCategories();
  }

  async addCategories(categories: Partial<Category>[]): Promise<Category[]> {
    return this.categoriesRepository.addCategories(categories);
  }

  /** Seeder para inicializar categorías */
  async seedCategories(): Promise<Category[]> {
    const categoriesData: Partial<Category>[] = [
      { name: 'Electrónica' },
      { name: 'Ropa' },
      { name: 'Hogar' },
      { name: 'Juguetes' },
      { name: 'Libros' },
    ];

    return this.addCategories(categoriesData);
  }
}
