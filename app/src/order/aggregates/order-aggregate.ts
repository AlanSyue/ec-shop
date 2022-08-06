import { OrderItem } from '../../entities/order-item.entity';

export class OrderInfo {
  private orderId: number;
  private total: number;
  private amount: number;
  private orderItems: OrderItem[];

  constructor(
    orderId: number,
    total: number,
    amount: number,
    orderItems: OrderItem[],
  ) {
    this.orderId = orderId;
    this.total = total;
    this.amount = amount;
    this.orderItems = orderItems;
  }

  public toObject() {
    const products = this.orderItems.map((orderItem) => {
      return {
        id: orderItem.productId,
        name: orderItem.product.name,
        price: orderItem.price,
        amount: orderItem.amount,
      };
    });
    
    return {
      id: this.orderId,
      total: this.total,
      amount: this.amount,
      items: products,
    };
  }
}
