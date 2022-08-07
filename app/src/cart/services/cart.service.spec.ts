import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { DataSource, In, IsNull } from 'typeorm';
import { Cart } from '../../entities/cart.entity';
import { CartService } from './cart.service';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { ProductOutOfStockError } from '../errors/product-out-of-stock-error';

describe('CartService', () => {
  let service: CartService;
  let dataSource;

  const mockCartRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSource = () => ({
    transaction: jest.fn()
  });

  const mockedManager = {
    getRepository: jest.fn(),
    update: jest.fn(),
    insert: jest.fn(),

  }

  const userId = 1

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: mockCartRepo,
        },
        {
          provide: DataSource,
          useFactory: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test find cart', () => {
    it('should find cart', async () => {
      const carts = [generateCart(1, 1), generateCart(2, 2)]

      const repoFindSpy = jest.spyOn(mockCartRepo, 'find')
        .mockImplementation(() => {
          return carts
        });

      const expected = carts.map((cart) => {
        const product = cart.product;

        return {
          id: product.id,
          cartId: cart.id,
          name: product.name,
          total: product.price * cart.amount,
          amount: cart.amount,
          price: product.price,
          inventory: product.inventory,
        };
      })

      const result = await service.findCart(userId)
      expect(result).toEqual(expected)
      expect(repoFindSpy).toBeCalledTimes(1)
      expect(repoFindSpy).toBeCalledWith({
        where: {
          userId: userId,
          orderId: IsNull(),
        },
        relations: {
          product: true,
        },
      })
    })
  })

  describe('test add to cart', () => {
    const repoSaveSpy = jest.spyOn(mockCartRepo, 'save');
    const repoInsertSpy = jest.spyOn(mockCartRepo, 'insert');

    it('should save', async () => {
      const productId = 1
      const cart = generateCart(1, productId)
      const amount = 1

      const repoFindOneBySpy = jest.spyOn(mockCartRepo, 'findOneBy')
        .mockImplementation(() => {
          return cart
        });

      cart.amount += amount
      await service.addToCart(userId, productId, amount)
      expect(repoFindOneBySpy).toBeCalledTimes(1)
      expect(repoFindOneBySpy).toBeCalledWith({
        userId: userId,
        productId: productId,
        orderId: IsNull(),
      })
      expect(repoSaveSpy).toBeCalledTimes(1)
      expect(repoSaveSpy).toBeCalledWith(cart)
      expect(repoInsertSpy).toBeCalledTimes(0)
    })

    it('should insert', async () => {
      const productId = 1
      const amount = 1

      const repoFindOneBySpy = jest.spyOn(mockCartRepo, 'findOneBy')
        .mockImplementation(() => {
          return null
        });

      await service.addToCart(userId, productId, amount)
      expect(repoFindOneBySpy).toBeCalledTimes(1)
      expect(repoFindOneBySpy).toBeCalledWith({
        userId: userId,
        productId: productId,
        orderId: IsNull(),
      })
      expect(repoSaveSpy).toBeCalledTimes(0)
      expect(repoInsertSpy).toBeCalledTimes(1)
      expect(repoInsertSpy).toBeCalledWith({
        userId: userId,
        productId: productId,
        amount: amount,
      })
    })
  })

  describe('test remove from cart', () => {
    const repoSaveSpy = jest.spyOn(mockCartRepo, 'save');
    const repoDeleteSpy = jest.spyOn(mockCartRepo, 'delete');

    it('should return', async () => {
      const productId = 1
      const amount = 1

      const repoFindOneBySpy = jest.spyOn(mockCartRepo, 'findOneBy')
        .mockImplementation(() => {
          return null
        });

      await service.removeFromCart(userId, productId, amount)
      expect(repoFindOneBySpy).toBeCalledTimes(1)
      expect(repoFindOneBySpy).toBeCalledWith({
        userId: userId,
        productId: productId,
      })
      expect(repoSaveSpy).toBeCalledTimes(0)
      expect(repoDeleteSpy).toBeCalledTimes(0)
    })

    it('should delete', async () => {
      const productId = 1
      const cart = generateCart(1, productId)
      const amount = 10

      const repoFindOneBySpy = jest.spyOn(mockCartRepo, 'findOneBy')
        .mockImplementation(() => {
          return cart
        });

      await service.removeFromCart(userId, productId, amount)
      expect(repoFindOneBySpy).toBeCalledTimes(1)
      expect(repoFindOneBySpy).toBeCalledWith({
        userId: userId,
        productId: productId,
      })
      expect(repoSaveSpy).toBeCalledTimes(0)
      expect(repoDeleteSpy).toBeCalledTimes(1)
      expect(repoDeleteSpy).toBeCalledWith(cart.id)
    })

    it('should save', async () => {
      const productId = 1
      const cart = generateCart(1, productId)
      const amount = 1

      const repoFindOneBySpy = jest.spyOn(mockCartRepo, 'findOneBy')
        .mockImplementation(() => {
          return cart
        });
      
      cart.amount -= amount

      await service.removeFromCart(userId, productId, amount)
      expect(repoFindOneBySpy).toBeCalledTimes(1)
      expect(repoFindOneBySpy).toBeCalledWith({
        userId: userId,
        productId: productId,
      })
      expect(repoSaveSpy).toBeCalledTimes(1)
      expect(repoSaveSpy).toBeCalledWith(cart)
      expect(repoDeleteSpy).toBeCalledTimes(0)
    })
  })

  describe('test checkout', () => {
    // it('should throw error', async () => {
    //   jest.spyOn(mockCartRepo, 'find')
    //     .mockImplementation(() => {
    //       return []
    //     });
        
    //   dataSource.transaction.mockImplementation((cb) => {
    //     cb(mockedManager);
    //   });

    //   try {
    //     await service.checkout(userId)
    //   } catch (error) {
    //     expect(error).toBeInstanceOf(Error)
    //     expect(error.message).toEqual('')
    //     expect(dataSource.transaction).toHaveBeenCalled();
    //   }
    // })

    // it('should execute success', async () => {
    //   const orderId = 1

    //   const carts = [generateCart(1, 1), generateCart(2, 2)]

    //   jest.spyOn(mockCartRepo, 'find')
    //     .mockImplementation(() => {
    //       return carts
    //     });

    //   dataSource.transaction.mockImplementation((cb) => {
    //     cb(mockedManager);
    //   });

    //   const insertResult = { raw: { insertId: orderId } }
    //   const managerGetRepoSpc = jest.spyOn(mockedManager, 'getRepository').mockReturnThis()
    //   const managerUpdateSpc = jest.spyOn(mockedManager, 'update').mockReturnThis()
    //   const managerInsertSpc = jest.spyOn(mockedManager, 'insert').mockReturnValueOnce(insertResult).mockReturnThis()

    //   await service.checkout(userId)
    //   expect(dataSource.transaction).toHaveBeenCalled();
    //   expect(managerGetRepoSpc).toHaveBeenCalledTimes(5)
    //   expect(managerGetRepoSpc).toHaveBeenNthCalledWith(1, Product)
    //   expect(managerGetRepoSpc).toHaveBeenNthCalledWith(2, Product)
    //   expect(managerGetRepoSpc).toHaveBeenNthCalledWith(3, Order)
    //   expect(managerGetRepoSpc).toHaveBeenNthCalledWith(4, OrderItem)
    //   expect(managerGetRepoSpc).toHaveBeenNthCalledWith(5, Cart)
      
    //   expect(managerUpdateSpc).toHaveBeenCalledTimes(3)
    //   expect(managerUpdateSpc).toHaveBeenNthCalledWith(1, { id: 1 }, { inventory: 90 })
    //   expect(managerUpdateSpc).toHaveBeenNthCalledWith(2, { id: 2 }, { inventory: 90 })
    //   expect(managerUpdateSpc).toHaveBeenNthCalledWith(3, { id: In([1, 2]) }, { orderId: orderId })

    //   expect(managerInsertSpc).toHaveBeenCalledTimes(2)
    //   expect(managerInsertSpc).toHaveBeenNthCalledWith(1, { 
    //     userId: userId,
    //     amount: 20,
    //     total: 200,
    //   })
    //   const cartOrderProducts = carts.map((cart) => {
    //     return {
    //       id: cart.productId,
    //       amount: cart.amount,
    //       price: cart.product.price,
    //     }
    //   })
    //   .map((cartProduct) => {
    //     return {
    //       orderId: orderId,
    //       productId: cartProduct.id,
    //       price: cartProduct.price,
    //       amount: cartProduct.amount,
    //     }
    //   })
    //   expect(managerInsertSpc).toHaveBeenNthCalledWith(2, cartOrderProducts)

    // })

    // it('should throw product out of stock error', async () => {
    //   const carts = [generateCart(1, 1), generateCart(2, 2, 101)]

    //   jest.spyOn(mockCartRepo, 'find')
    //     .mockImplementation(() => {
    //       return carts
    //     });

    //   dataSource.transaction.mockImplementation((cb) => {
    //     cb(mockedManager);
    //   });

    //   mockedManager.getRepository.mockReturnThis()

    //   try {
    //     await service.checkout(userId)
    //   } catch (error) {
    //     expect(error).toBeInstanceOf(ProductOutOfStockError)
    //     expect(error.message).toEqual(ProductOutOfStockError.ERROR_MESSAGE)
    //     expect(dataSource.transaction).toHaveBeenCalled();
    //     expect(mockedManager.getRepository).toHaveBeenCalledTimes(1)
    //     expect(mockedManager.getRepository).toHaveBeenNthCalledWith(1, Product)
    //     expect(mockedManager.update).toHaveBeenCalledTimes(1)
    //     expect(mockedManager.update).toHaveBeenNthCalledWith(1, { id: 1 }, { inventory: 90 })
    //   }
      
    // })
  })
});

const generateCart = (cartId: number, productId: number, amount = 10) => {
  const cart = new Cart()
  cart.id = cartId
  cart.productId = productId
  cart.amount = amount
  cart.product = generateProduct(productId)

  return cart
}

const generateProduct = (productId: number): Product => {
  const product = new Product()
  product.id = productId
  product.name = 'product'
  product.price = 10
  product.inventory = 100

  return product
}
