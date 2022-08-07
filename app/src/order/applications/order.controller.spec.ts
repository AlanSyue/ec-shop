import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../../entities/product.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Order } from '../../entities/order.entity';
import { OrderInfo } from '../aggregates/order-aggregate';
import { OrderService } from '../services/order.service';
import { OrderController } from './order.controller';
import { Response } from 'express';
import { InvalidOrderError } from '../errors/invalid-order-error';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    findAll: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
      controllers: [OrderController],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test find all method', () => {
    it('should response ok', () => {
      const request = { user: { id: 1 } };

      const orders = [generateOrder(1)];
      const ordersInfo = orders.map((order) => {
        return generateOrderInfo(order);
      });

      const expected = ordersInfo.map((orderInfo: OrderInfo) => {
        return orderInfo.toObject();
      });

      const serviceFindAllSpy = jest
        .spyOn(mockOrderService, 'findAll')
        .mockImplementation(async () => {
          return ordersInfo;
        });

      expect(controller.findAll(request)).toEqual(Promise.resolve(expected));
      expect(serviceFindAllSpy).toBeCalledTimes(1);
      expect(serviceFindAllSpy).toBeCalledWith(request.user.id);
    });
  });

  describe('test find method', () => {
    it('should response ok', () => {
      const response = {};
      const request = { user: { id: 1 } };
      const orderId = 1;
      const order = generateOrder(orderId);
      const orderInfo = generateOrderInfo(order);

      const serviceFindSpy = jest
        .spyOn(mockOrderService, 'find')
        .mockImplementation(async () => {
          return orderInfo;
        });

      expect(controller.find(response as any, request, orderId)).toEqual(
        Promise.resolve(orderInfo.toObject()),
      );
      expect(serviceFindSpy).toBeCalledTimes(1);
      expect(serviceFindSpy).toBeCalledWith(request.user.id, orderId);
    });

    it('should throw invalid order error', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockImplementation().mockReturnValue(404),
        json: jest.fn().mockImplementation().mockReturnValue({
          error_code: InvalidOrderError.ERROR_CODE,
          error_message: InvalidOrderError.ERROR_MESSAGE,
        }),
      };
      const orderId = 1;
      const request = { user: { id: 1 } };

      const serviceFindSpy = jest
        .spyOn(mockOrderService, 'find')
        .mockImplementation(async () => {
          throw new InvalidOrderError();
        });

      const result = await controller.find(
        mockResponse as any,
        request,
        orderId,
      );
      expect(result).toBe(mockResponse.json());
      expect(serviceFindSpy).toBeCalledTimes(1);
    });
  });
});

const generateOrder = (orderId: number): Order => {
  const orderItem = new OrderItem();
  const product = new Product();
  product.name = 'product name';
  orderItem.product = product;
  const order = new Order();
  order.id = orderId;
  order.total = 1;
  order.amount = 1;
  order.orderItems = [orderItem];

  return order;
};

const generateOrderInfo = (order: Order): OrderInfo => {
  return new OrderInfo(order.id, order.total, order.amount, order.orderItems);
};
