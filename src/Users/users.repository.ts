import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** 🔹 Obtener todos los usuarios (sin password) */
  async getUsers(): Promise<Partial<User>[]> {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        country: true,
        city: true,
      },
    });
  }

  /** 🔹 Obtener usuario por ID con órdenes (solo id y date) */
  async getUserById(id: string): Promise<Partial<User> | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { orders: true },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        country: true,
        city: true,
        orders: {
          id: true,
          date: true,
        },
      },
    });
  }

  /** 🔹 Buscar usuario por email (INCLUYE password → Auth) */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  /** 🔹 Crear usuario (password ya viene hasheada) */
  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  /** 🔹 Actualizar usuario (sin tocar password por defecto) */
  async updateUser(
    id: string,
    updateData: Partial<User>,
  ): Promise<Partial<User> | null> {
    const result = await this.userRepository.update(id, updateData);

    if (result.affected === 0) {
      return null;
    }

    return this.getUserById(id);
  }

  /** 🔹 Eliminar usuario */
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}
