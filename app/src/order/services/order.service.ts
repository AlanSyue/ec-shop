import { OrderInfo } from '../aggregates/order-aggregate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { Repository } from 'typeorm';
import { InvalidOrderError } from '../errors/invalid-order-error';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  public async findAll(userId: number): Promise<OrderInfo[]> {
    const orders = await this.orderRepository.find({
      where: { userId: userId },
      relations: ['orderItems', 'orderItems.product'],
    });

    return orders.map((order) => {
      return new OrderInfo(
        order.id,
        order.total,
        order.amount,
        order.orderItems,
      );
    });
  }

  public async find(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        userId: userId,
      },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new InvalidOrderError();
    }

    return new OrderInfo(order.id, order.total, order.amount, order.orderItems);
  }
}
