import { CartProduct } from './../dtos/cart-dto';

export class CartAggregate {
    private _products: CartProduct[] = [];

    set products(product: CartProduct) {
        this._products.push(product)
    }

    public cartAmount(): number {
        return this._products.map((product) => {
            return product.amount
        })
            .reduce((total, current) => {
                return total + current
            }, 0)
    }

    public cartTotal(): number {
        return this._products.map((product) => {
            return product.total
        })
            .reduce((total, current) => {
                return total + current
            }, 0)
    }

    public cartIds(): number[] {
        return this._products.map((product) => {
            return product.cartId
        })
    }

    public cartOrderProducts(orderId: number) {
        return this._products.map((product) => {
            return {
                orderId: orderId,
                productId: product.id,
                price: product.price,
                amount: product.amount,
            }
        })
    }
}
