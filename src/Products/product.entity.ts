import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../Categories/category.entity';
import { OrderDetail } from '../OrderDetails/order-detail.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'UUID único del producto',
    example: '9c858901-8a57-4791-81fe-4c455b099bc9',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Smartphone Samsung Galaxy',
  })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Smartphone con 128GB de almacenamiento y 6GB de RAM',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 299999.99,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 50,
  })
  @Column('int')
  stock: number;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://res.cloudinary.com/demo/image/upload/product.jpg',
  })
  @Column({ nullable: true })
  imgUrl: string;

  @ApiProperty({
    description: 'Categoría a la que pertenece el producto',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  })
  category: Category;

  @ApiProperty({
    description: 'Detalles de órdenes que incluyen este producto',
    type: () => [OrderDetail],
    required: false,
  })
  @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
  @JoinTable()
  orderDetails: OrderDetail[];
}
