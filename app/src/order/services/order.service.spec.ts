import { OrderInfo } from './../aggregates/order-aggregate';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItem } from '../../entities/order-item.entity';
import { Order } from '../../entities/order.entity';
import { OrderService } from './order.service';
import { InvalidOrderError } from '../errors/invalid-order-error';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test find all orders method', () => {
    it('should return result', async () => {
      const userId = 1;
      const orders = [generateOrder(1)];

      const repoFindSpy = jest
        .spyOn(mockOrderRepo, 'find')
        .mockImplementation((): Order[] => {
          return orders;
        });

      const expected = orders.map((order) => {
        return generateOrderInfo(order);
      });

      const result = await service.findAll(userId);
      expect(result).toEqual(expected);
      expect(repoFindSpy).toBeCalledTimes(1);
      expect(repoFindSpy).toBeCalledWith({
        where: { userId },
        relations: ['orderItems', 'orderItems.product'],
      });
    });
  });

  describe('test find order method', () => {
    it('should return result', async () => {
      const userId = 1;
      const orderId = 1;
      const order = generateOrder(orderId);

      const repoFindOneSpy = jest
        .spyOn(mockOrderRepo, 'findOne')
        .mockImplementation((): Order => {
          return order;
        });

      const expected = generateOrderInfo(order);

      const result = await service.find(userId, orderId);
      expect(result).toEqual(expected);
      expect(repoFindOneSpy).toBeCalledTimes(1);
      expect(repoFindOneSpy).toBeCalledWith({
        where: {
          id: orderId,
          userId: userId,
        },
        relations: ['orderItems', 'orderItems.product'],
      });
    });

    it('should throw invalid order error', async () => {
      const userId = 1;
      const orderId = 1;

      const repoFindOneSpy = jest
        .spyOn(mockOrderRepo, 'findOne')
        .mockImplementation(() => {
          return null;
        });

      try {
        await service.find(userId, orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidOrderError);
        expect(error.message).toEqual(InvalidOrderError.ERROR_MESSAGE);
        expect(repoFindOneSpy).toBeCalledTimes(1);
        expect(repoFindOneSpy).toBeCalledWith({
          where: {
            id: orderId,
            userId: userId,
          },
          relations: ['orderItems', 'orderItems.product'],
        });
      }
    });
  });
});

const generateOrder = (orderId: number): Order => {
  const order = new Order();
  order.id = orderId;
  order.total = 1;
  order.amount = 1;
  order.orderItems = [new OrderItem()];

  return order;
};

const generateOrderInfo = (order: Order): OrderInfo => {
  return new OrderInfo(order.id, order.total, order.amount, order.orderItems);
};
