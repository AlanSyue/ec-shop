import { Test, TestingModule } from '@nestjs/testing';
import { ProductQueryDto } from '../dtos/product-query-dto';
import { ProductNotFoundError } from '../errors/product-not-found-error';
import { ProductService } from '../services/product.service';
import { ProductController } from './product.controller';
import { Response } from 'express';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProductService = {
    findAll: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test find all method', () => {
    it('should response ok', () => {
      const dto = new ProductQueryDto();
      dto.skip = 0
      dto.take = 10

      const expected = {}

      const serviceFindAllSpy = jest.spyOn(mockProductService, 'findAll')
        .mockImplementation(async () => {
          return expected
        });

      expect(controller.findAll(dto)).toEqual(Promise.resolve(expected));
      expect(serviceFindAllSpy).toBeCalledTimes(1);
      expect(serviceFindAllSpy).toBeCalledWith(dto.take, dto.skip);
    });
  })

  describe('test find method', () => {
    it('should response ok', () => {
      const response = {}
      const productId = 1
      const expected = {}

      const serviceFindSpy = jest.spyOn(mockProductService, 'find')
        .mockImplementation(async () => {
          return expected
        });

      expect(controller.find(response as any, productId)).toEqual(Promise.resolve(expected));
      expect(serviceFindSpy).toBeCalledTimes(1);
      expect(serviceFindSpy).toBeCalledWith(productId);
    });

    it('should throw product not found error', async () => {
      const mockResponse: Partial<Response> = {
        status: jest.fn().mockImplementation().mockReturnValue(400),
        json: jest.fn().mockImplementation().mockReturnValue({
          error_code: ProductNotFoundError.ERROR_CODE,
          error_message: ProductNotFoundError.ERROR_MESSAGE
        }),
      }
      const productId = 1

      const serviceFindSpy = jest.spyOn(mockProductService, 'find')
        .mockImplementation(async () => {
          throw new ProductNotFoundError()
        });

      const result = await controller.find(mockResponse as any, productId)
      expect(result).toBe(mockResponse.json())
      expect(serviceFindSpy).toBeCalledTimes(1);

    });
  })
});
