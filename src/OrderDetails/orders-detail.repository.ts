import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './order-detail.entity';

@Injectable()
export class OrdersDetailRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly repository: Repository<OrderDetail>,
  ) {}

  /** Obtener todos los detalles */
  async getAll(): Promise<OrderDetail[]> {
    return await this.repository.find({
      relations: ['products', 'order'],
    });
  }

  /** Obtener un detalle por ID */
  async getById(id: string): Promise<OrderDetail | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['products', 'order'],
    });
  }

  /** Crear un detalle */
  async create(data: Partial<OrderDetail>): Promise<OrderDetail> {
    const newDetail = this.repository.create(data);
    return await this.repository.save(newDetail);
  }

  /** Actualizar un detalle */
  async update(
    id: string,
    data: Partial<OrderDetail>,
  ): Promise<OrderDetail | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) return null;

    const updated = this.repository.merge(existing, data);
    return await this.repository.save(updated);
  }

  /** Eliminar un detalle */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
