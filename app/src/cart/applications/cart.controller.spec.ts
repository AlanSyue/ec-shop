import { Test, TestingModule } from '@nestjs/testing';
import { OrderInfo } from '../../order/aggregates/order-aggregate';
import { OrderService } from '../../order/services/order.service';
import { CartDto, CartProduct } from '../dtos/cart-dto';
import { CartService } from '../services/cart.service';
import { CartController } from './cart.controller';

describe('CartController', () => {
  let controller: CartController;

  const mockCartService = {
    findCart: jest.fn(),
    checkout: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  };

  const mockOrderService = {
    find: jest.fn(),
  };

  const request = { user: { id: 1 } };
  const productId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
      controllers: [CartController],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test find cart method', () => {
    it('should return cart products', async () => {
      const cartProducts = [generateCartProduct(1, 1)];

      const serviceFindCartSpy = jest
        .spyOn(mockCartService, 'findCart')
        .mockImplementation(async () => {
          return cartProducts;
        });

      const result = await controller.findCart(request);
      const expected = {
        data: cartProducts,
      };
      expect(result).toEqual(expected);
      expect(serviceFindCartSpy).toBeCalledTimes(1);
      expect(serviceFindCartSpy).toBeCalledWith(request.user.id);
    });
  });

  describe('test checkout method', () => {
    it('should return order info', async () => {
      const orderId = 1;
      const orderInfo = new OrderInfo(orderId, 1, 1, []);

      const serviceCheckoutSpy = jest
        .spyOn(mockCartService, 'checkout')
        .mockImplementation(async () => {
          return orderId;
        });

      const orderServiceFindSpy = jest
        .spyOn(mockOrderService, 'find')
        .mockImplementation(async () => {
          return orderInfo;
        });

      const expected = {
        data: orderInfo.toObject(),
      };

      const result = await controller.checkout(request);
      expect(result).toEqual(expected);
      expect(serviceCheckoutSpy).toBeCalledTimes(1);
      expect(serviceCheckoutSpy).toBeCalledWith(request.user.id);
      expect(orderServiceFindSpy).toBeCalledTimes(1);
      expect(orderServiceFindSpy).toBeCalledWith(request.user.id, orderId);
    });
  });

  describe('test add to cart method', () => {
    it('should add to cart', async () => {
      const cartDto = new CartDto();
      cartDto.amount = 1;

      const serviceCheckoutSpy = jest.spyOn(mockCartService, 'addToCart');

      expect(await controller.addToCart(request, productId, cartDto));
      expect(serviceCheckoutSpy).toBeCalledTimes(1);
      expect(serviceCheckoutSpy).toBeCalledWith(
        request.user.id,
        productId,
        cartDto.amount,
      );
    });
  });

  describe('test remove from cart method', () => {
    it('should remove from cart', async () => {
      const cartDto = new CartDto();
      cartDto.amount = 1;

      const serviceCheckoutSpy = jest.spyOn(mockCartService, 'removeFromCart');

      expect(await controller.removeFromCart(request, productId, cartDto));
      expect(serviceCheckoutSpy).toBeCalledTimes(1);
      expect(serviceCheckoutSpy).toBeCalledWith(
        request.user.id,
        productId,
        cartDto.amount,
      );
    });
  });
});

const generateCartProduct = (
  productId: number,
  cartId: number,
): CartProduct => {
  return {
    id: productId,
    cartId: cartId,
    name: 'name',
    total: 1,
    amount: 1,
    price: 10,
    inventory: 10,
  };
};
