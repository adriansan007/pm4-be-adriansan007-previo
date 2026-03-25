import { ApiProperty } from '@nestjs/swagger';
import { OrderDetailResponseDto } from '../../OrderDetails/dtos/order-detail-response.dto';

export class OrderResponseDto {
  @ApiProperty({
    example: 'b7c2f3d4-9e4a-4c8a-a3e2-1f4a8d2c9876',
    description: 'ID de la orden',
  })
  id: string;

  @ApiProperty({
    example: '2026-02-23T14:32:00.000Z',
    description: 'Fecha de creación de la orden',
  })
  date: Date;

  @ApiProperty({
    example: 45000.5,
    description: 'Total final de la orden',
  })
  total: number;

  @ApiProperty({
    type: () => OrderDetailResponseDto,
    description: 'Detalle asociado a la orden',
  })
  orderDetail: OrderDetailResponseDto;
}
