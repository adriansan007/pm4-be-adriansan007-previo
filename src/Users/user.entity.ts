import { Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { Order } from '../Orders/order.entity';
import { Role } from '../roles.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'UUID único del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan@email.com',
  })
  @Column({ length: 100, unique: true })
  email: string;

  @ApiProperty({
    description: 'Contraseña encriptada del usuario',
    example: '$2b$10$EixZaYVK1fsbw1ZfbX3OXe',
  })
  @Column({ length: 100 })
  password: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Siempre Viva 742',
  })
  @Column({ type: 'text' })
  address: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '3511234567',
  })
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @ApiPropertyOptional({
    description: 'País de residencia',
    example: 'Argentina',
  })
  @Column({ length: 50, nullable: true })
  country?: string;

  @ApiPropertyOptional({
    description: 'Ciudad de residencia',
    example: 'Córdoba',
  })
  @Column({ length: 50, nullable: true })
  city?: string;

  @ApiProperty({
    description: 'Rol del usuario dentro del sistema',
    enum: Role,
    example: Role.User,
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @ApiProperty({
    description: 'Lista de órdenes asociadas al usuario',
    type: () => [Order],
    required: false,
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}