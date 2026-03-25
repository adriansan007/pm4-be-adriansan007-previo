import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDetail } from './order-detail.entity';
import { OrdersDetailRepository } from './orders-detail.repository';

@Injectable()
export class OrderDetailService {
  constructor(private readonly repository: OrdersDetailRepository) {}

  /** Obtener todos los detalles de pedidos */
  async getAll(): Promise<OrderDetail[]> {
    try {
      return await this.repository.getAll();
    } catch (error: unknown) {
      throw new NotFoundException(this.safeErrorMessage(error));
    }
  }

  /** Obtener un detalle de pedido por ID */
  async getById(id: string): Promise<OrderDetail> {
    try {
      const entity = await this.repository.getById(id);
      if (!entity) {
        throw new NotFoundException(`OrderDetail con ID ${id} no encontrado.`);
      }
      return entity;
    } catch (error: unknown) {
      throw new NotFoundException(this.safeErrorMessage(error));
    }
  }

  /** Crear un nuevo detalle de pedido */
  async create(data: Partial<OrderDetail>): Promise<OrderDetail> {
    try {
      return await this.repository.create(data);
    } catch (error: unknown) {
      throw new NotFoundException(this.safeErrorMessage(error));
    }
  }

  /** Actualizar un detalle de pedido existente */
  async update(id: string, data: Partial<OrderDetail>): Promise<OrderDetail> {
    try {
      const updated = await this.repository.update(id, data);
      if (!updated) {
        throw new NotFoundException(`OrderDetail con ID ${id} no encontrado.`);
      }
      return updated;
    } catch (error: unknown) {
      throw new NotFoundException(this.safeErrorMessage(error));
    }
  }

  /** Eliminar un detalle de pedido */
  async delete(id: string): Promise<string> {
    try {
      const deleted = await this.repository.delete(id);
      if (!deleted) {
        throw new NotFoundException(`OrderDetail con ID ${id} no encontrado.`);
      }
      return id;
    } catch (error: unknown) {
      throw new NotFoundException(this.safeErrorMessage(error));
    }
  }

  /** 🔹 Helper para convertir cualquier error a string seguro */
  private safeErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try {
      return JSON.stringify(error);
    } catch {
      return 'Error desconocido';
    }
  }
}
