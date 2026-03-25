import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  Column,
} from 'typeorm';
import { Product } from '../Products/product.entity';
import { Order } from '../Orders/order.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @OneToOne(() => Order, (order) => order.orderDetail, { nullable: false })
  order: Order;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];
}
