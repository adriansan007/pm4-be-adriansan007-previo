import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';

import { OrdersRepository } from './orders.repository';
import { Order } from './order.entity';
import { OrderDetail } from '../OrderDetails/order-detail.entity';
import { Product } from '../Products/product.entity';
import { User } from '../Users/user.entity';
import { CreateOrderDto } from './dtos/createOrder.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailsRepository: Repository<OrderDetail>,
  ) {}

  /**
   * Crear una orden de compra
   */
  async addOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, products } = createOrderDto;

    // 1️⃣ Buscar usuario
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 2️⃣ Validar productos enviados
    const productIds = products.map((p) => p.id);

    if (productIds.length === 0) {
      throw new BadRequestException('No se enviaron productos');
    }

    // 3️⃣ Buscar productos con stock > 0
    const availableProducts = await this.productsRepository.find({
      where: {
        id: In(productIds),
        stock: MoreThan(0),
      },
    });

    if (availableProducts.length !== productIds.length) {
      const foundIds = availableProducts.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));

      throw new BadRequestException(
        `Los siguientes productos no existen o no tienen stock: ${missingIds.join(', ')}`,
      );
    }

    // 4️⃣ Calcular total
    const total = availableProducts.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    // 5️⃣ Crear detalle de orden
    const orderDetail = new OrderDetail();
    orderDetail.products = availableProducts;
    orderDetail.price = total;

    const savedOrderDetail =
      await this.orderDetailsRepository.save(orderDetail);

    // 6️⃣ Crear orden
    const order = new Order();
    order.user = user;
    order.total = total;
    order.orderDetail = savedOrderDetail;

    const savedOrder = await this.ordersRepository.addOrder(order);

    // 7️⃣ Reducir stock
    availableProducts.forEach((product) => {
      product.stock -= 1;
    });

    await this.productsRepository.save(availableProducts);

    // 8️⃣ Recuperar orden completa con relaciones
    const fullOrder = await this.ordersRepository.getOrder(savedOrder.id);

    if (!fullOrder) {
      throw new NotFoundException('Error al recuperar la orden creada');
    }

    return fullOrder;
  }

  /**
   * Obtener una orden por ID
   */
  async getOrder(orderId: string): Promise<Order> {
    const order = await this.ordersRepository.getOrder(orderId);

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  /**
   * Obtener todas las órdenes
   */
  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.getOrders();
  }
}
