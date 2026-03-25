import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  Logger,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderResponseDto } from './dtos/orders-response.dto';
import { Order } from './order.entity';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /orders
   */
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva orden (requiere autenticación)' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Orden creada correctamente',
    type: OrderResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    try {
      const order = await this.ordersService.addOrder(createOrderDto);
      return this.mapToResponseDto(order);
    } catch (error) {
      this.logger.error('POST /orders -> Error al crear la orden');
      throw error;
    }
  }

  /**
   * GET /orders
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({
    status: 200,
    description: 'Listado de órdenes',
    type: OrderResponseDto,
    isArray: true,
  })
  async getAllOrders(): Promise<OrderResponseDto[]> {
    try {
      const orders = await this.ordersService.getOrders();
      return orders.map((order) => this.mapToResponseDto(order));
    } catch {
      this.logger.error('GET /orders -> Error inesperado');
      throw new InternalServerErrorException(
        'Error inesperado al obtener las órdenes',
      );
    }
  }

  /**
   * GET /orders/:id
   */
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener una orden por ID (requiere autenticación)',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la orden',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
    type: OrderResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    try {
      const order = await this.ordersService.getOrder(id);
      return this.mapToResponseDto(order);
    } catch (error) {
      this.logger.error(`GET /orders/${id} -> Error al obtener la orden`);
      throw error;
    }
  }

  // 🔥 Mapper alineado EXACTAMENTE a tus DTO reales
  private mapToResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      date: order.date,
      total: order.total,
      orderDetail: {
        id: order.orderDetail.id,
        quantity: order.orderDetail.products.length,
        subtotal: order.orderDetail.price,
      },
    };
  }
}
