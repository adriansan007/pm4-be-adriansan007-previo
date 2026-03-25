import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../Products/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
  @ApiProperty({
    description: 'UUID único de la categoría',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónica',
  })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    description: 'Lista de productos asociados a la categoría',
    type: () => [Product],
    required: false,
  })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
