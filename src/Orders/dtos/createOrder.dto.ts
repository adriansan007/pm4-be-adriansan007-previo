import {
  IsUUID,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO parcial para representar un producto dentro de la orden
 */
export class ProductPartialDto {
  @ApiProperty({
    example: 'a1b2c3d4-5678-4abc-9def-123456789abc',
    description: 'ID del producto',
  })
  @IsNotEmpty()
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  id: string;
}

/**
 * DTO para crear una orden
 */
export class CreateOrderDto {
  @ApiProperty({
    example: 'b7c2f3d4-9e4a-4c8a-a3e2-1f4a8d2c9876',
    description: 'ID del usuario que realiza la orden',
  })
  @IsNotEmpty({ message: 'El userId es obligatorio' })
  @IsUUID('4', { message: 'El userId debe ser un UUID válido' })
  userId: string;

  @ApiProperty({
    type: [ProductPartialDto],
    description: 'Lista de productos que componen la orden',
    example: [{ id: 'prod-uuid-1' }, { id: 'prod-uuid-2' }],
  })
  @IsArray({ message: 'products debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe existir al menos un producto en la orden' })
  @ValidateNested({ each: true })
  @Type(() => ProductPartialDto)
  products: ProductPartialDto[];
}
