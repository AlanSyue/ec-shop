import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CartController } from './applications/cart.controller';
import { CartService } from './services/cart.service';
import { Cart } from 'src/entities/cart.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { OrderService } from 'src/order/services/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Order, OrderItem, Product])],
  controllers: [CartController],
  providers: [CartService, OrderService],
})
export class CartModule {}
