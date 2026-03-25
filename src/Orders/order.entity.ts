import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../Users/user.entity';
import { OrderDetail } from '../OrderDetails/order-detail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('orders')
export class Order {
  @ApiProperty({
    description: 'UUID único de la orden',
    example: 'c1a3f0f0-3d6e-4f3e-b7a2-2b6e2c8a9d11',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Usuario que realizó la orden',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user: User;

  @ApiProperty({
    description: 'Fecha de creación de la orden',
    example: '2026-02-23T20:15:30.000Z',
  })
  @CreateDateColumn()
  date: Date;

  @ApiProperty({
    description: 'Detalle de la orden',
    type: () => OrderDetail,
  })
  @OneToOne(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: true,
  })
  @JoinColumn()
  orderDetail: OrderDetail;

  @ApiProperty({
    description: 'Monto total de la orden',
    example: 599999.99,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;
}
