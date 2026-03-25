import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataBaseModule } from './database/database.module';
import { AuthModule } from './Auth/auth.module';
import { UsersModule } from './Users/users.module';
import { ProductsModule } from './Products/products.module';
import { OrdersModule } from './Orders/orders.module';
import { OrderDetailsModule } from './OrderDetails/order-details.module';
import { FilesModule } from './files/files.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [
    // 🔑 CONFIG GLOBAL (CLAVE PARA JWT)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DataBaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    OrderDetailsModule,
    FilesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
