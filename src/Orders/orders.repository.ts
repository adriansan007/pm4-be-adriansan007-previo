import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  /** Guardar una orden */
  async addOrder(order: Order): Promise<Order> {
    return this.orderRepo.save(order);
  }

  /** Obtener una orden por id con detalle y productos */
  async getOrder(orderId: string): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['user', 'orderDetail', 'orderDetail.products'],
    });
  }

  /** Obtener todas las órdenes con detalle y productos */
  async getOrders(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['user', 'orderDetail', 'orderDetail.products'],
    });
  }
}
