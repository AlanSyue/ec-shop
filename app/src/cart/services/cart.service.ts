import { CartAggregate } from './../aggregates/cart-aggregate';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { DataSource, Repository, In, IsNull, EntityManager } from 'typeorm';
import { Cart } from '../../entities/cart.entity';
import { ProductOutOfStockError } from '../errors/product-out-of-stock-error';
import { Product } from '../../entities/product.entity';
import { CartProduct } from '../dtos/cart-dto';
import { OrderItem } from '../../entities/order-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private dataSource: DataSource,
  ) {}

  public async findCart(userId: number): Promise<CartProduct[]> {
    const unCheckoutCarts = await this.cartRepository.find({
      where: {
        userId: userId,
        orderId: IsNull(),
      },
      relations: {
        product: true,
      },
    });

    return unCheckoutCarts.map((cart) => {
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
    });
  }

  public async addToCart(userId: number, productId: number, amount: number) {
    const cart = await this.cartRepository.findOneBy({
      userId: userId,
      productId: productId,
      orderId: IsNull(),
    });

    if (cart) {
      cart.amount += amount;
      await this.cartRepository.save(cart);

      return;
    }

    await this.cartRepository.insert({
      userId: userId,
      productId: productId,
      amount: amount,
    });
  }

  public async removeFromCart(
    userId: number,
    productId: number,
    amount: number,
  ) {
    const cart = await this.cartRepository.findOneBy({
      userId: userId,
      productId: productId,
    });

    if (!cart) {
      return;
    }

    cart.amount -= amount;

    if (cart.amount <= 0) {
      await this.cartRepository.delete(cart.id);
      return;
    }

    await this.cartRepository.save(cart);
  }

  public async checkout(userId: number): Promise<number> {
    return await this.dataSource.transaction(async (manager) => {
      const products = await this.findCart(userId);

      if (products.length === 0) {
        throw new Error();
      }
      const cartAggregate = await this.preCheckout(products, manager);

      return await this.createOrder(userId, cartAggregate, manager);
    });
  }

  private async preCheckout(
    products: CartProduct[],
    manager: EntityManager,
  ): Promise<CartAggregate> {
    const cartAggregate = new CartAggregate();
    
    const setProducts = products.map(async (product: CartProduct) => {
      if (product.inventory < product.amount) {
        throw new ProductOutOfStockError(product.name);
      }

      const newInventory = product.inventory - product.amount;

      await manager
        .getRepository(Product)
        .update({ id: product.id }, { inventory: newInventory });

      cartAggregate.products = product;
    })

    await Promise.all(setProducts);
    await manager
      .getRepository(Product)
    return cartAggregate;
  }

  private async createOrder(
    userId: number,
    cart: CartAggregate,
    manager: EntityManager,
  ): Promise<number> {
    const amount = cart.cartAmount();
    const total = cart.cartTotal();

    const order = await manager.getRepository(Order).insert({
      userId: userId,
      amount: amount,
      total: total,
    });

    const orderId: number = order.raw.insertId;

    await manager
      .getRepository(OrderItem)
      .insert(cart.cartOrderProducts(orderId));

    await manager
      .getRepository(Cart)
      .update({ id: In(cart.cartIds()) }, { orderId: orderId });

    return orderId;
  }
}
