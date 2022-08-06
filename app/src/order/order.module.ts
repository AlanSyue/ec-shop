import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderController } from './applications/order.controller';
import { OrderService } from './services/order.service';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
