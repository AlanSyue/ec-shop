import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductNotFoundError } from '../errors/product-not-found-error';

describe('ProductService', () => {
  let service: ProductService;

  const mockProductRepo = {
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test find all products method', () => {
    it('should return result', async () => {
      const product1 = getMockProduct(1);
      const product2 = getMockProduct(2);
      const take = 10;
      const skip = 0;

      const repoFindAndCountSpy = jest
        .spyOn(mockProductRepo, 'findAndCount')
        .mockImplementation(() => {
          return [[product1, product2], 2];
        });

      const result = await service.findAll(take, skip);
      const expected = {
        products: [product1.toObject(), product2.toObject()],
        total: 2,
      };
      expect(repoFindAndCountSpy).toBeCalledWith({ take, skip });
      expect(repoFindAndCountSpy).toBeCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe('test find product method', () => {
    it('should return result', async () => {
      const productId = 1;
      const product = getMockProduct(productId);

      const repoFindOneBySpy = jest
        .spyOn(mockProductRepo, 'findOneBy')
        .mockImplementation(() => {
          return product;
        });

      const result = await service.find(productId);
      const expected = product.toObject();
      expect(repoFindOneBySpy).toBeCalledWith({ id: productId });
      expect(repoFindOneBySpy).toBeCalledTimes(1);
      expect(result).toEqual(expected);
    });

    it('should throw product not found error', async () => {
      const productId = 1;

      const repoFindOneBySpy = jest
        .spyOn(mockProductRepo, 'findOneBy')
        .mockImplementation(() => {
          return null;
        });

      try {
        await service.find(productId);
      } catch (error) {
        expect(error).toBeInstanceOf(ProductNotFoundError);
        expect(error.message).toBe(ProductNotFoundError.ERROR_MESSAGE);
        expect(repoFindOneBySpy).toBeCalledWith({ id: productId });
        expect(repoFindOneBySpy).toBeCalledTimes(1);
      }
    });
  });
});

const getMockProduct = (id: number) => {
  const product = new Product();
  product.id = id;
  product.name = 'product name';
  product.price = 10;
  product.inventory = 100;
  product.createdAt = new Date();
  product.updatedAt = new Date();

  return product;
};
