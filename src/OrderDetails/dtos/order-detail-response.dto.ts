import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailResponseDto {
  @ApiProperty({
    example: 'a8f3d8e3-6a1c-4b1a-b4e1-8f2c8d9a1234',
    description: 'ID del detalle de la orden',
  })
  id: string;

  @ApiProperty({
    example: 3,
    description: 'Cantidad total de productos en la orden',
  })
  quantity: number;

  @ApiProperty({
    example: 45000.5,
    description: 'Subtotal calculado del detalle',
  })
  subtotal: number;
}
