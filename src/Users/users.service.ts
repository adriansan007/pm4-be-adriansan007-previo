import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /** 🔹 Obtener todos los usuarios (sin password) */
  async getUsers(): Promise<Partial<User>[]> {
    try {
      return await this.usersRepository.getUsers();
    } catch {
      throw new InternalServerErrorException(
        'No se pudieron obtener los usuarios',
      );
    }
  }

  /** 🔹 Obtener usuario por ID */
  async getUserById(id: string): Promise<Partial<User>> {
    try {
      const user = await this.usersRepository.getUserById(id);

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return user;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(
        'Error al obtener el usuario por ID',
      );
    }
  }

  /** 🔹 Obtener usuario por email (usado por Auth) */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findByEmail(email);
    } catch {
      throw new InternalServerErrorException(
        'Error al buscar usuario por email',
      );
    }
  }

  /** 🔹 Crear un nuevo usuario */
  async createUser(data: Partial<User>): Promise<User> {
    try {
      if (!data.email) {
        throw new ConflictException('El email es obligatorio');
      }

      const existingUser = await this.usersRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException(
          `El email ${data.email} ya está registrado`,
        );
      }

      return await this.usersRepository.createUser(data);
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      throw err;
    }
  }

  /** 🔹 Actualizar usuario */
  async updateUser(
    id: string,
    updateData: Partial<User>,
  ): Promise<Partial<User>> {
    try {
      const updatedUser = await this.usersRepository.updateUser(id, updateData);

      if (!updatedUser) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return updatedUser;
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException(
        'No se pudo actualizar el usuario',
      );
    }
  }

  /** 🔹 Eliminar usuario */
  async deleteUser(id: string): Promise<string> {
    try {
      const deleted = await this.usersRepository.deleteUser(id);

      if (!deleted) {
        throw new ConflictException(
          `No se puede eliminar el usuario con ID ${id}`,
        );
      }

      return `Usuario con ID ${id} eliminado correctamente`;
    } catch (err) {
      if (err instanceof ConflictException) throw err;
      throw new InternalServerErrorException('No se pudo eliminar el usuario');
    }
  }
}
