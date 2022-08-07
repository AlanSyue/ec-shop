import { CartProduct } from "../dtos/cart-dto"
import { CartAggregate } from "./cart-aggregate"

const generateCartProduct = (productId: number, cartId: number): CartProduct => {
    return {
        id: productId,
        cartId: cartId,
        name: 'name',
        total: 1,
        amount: 1,
        price: 10,
        inventory: 10,
    }
}

describe('CartAggregate', () => {
    const cartAggregate = new CartAggregate()

    const products: CartProduct[]  = [
        generateCartProduct(1, 1),
        generateCartProduct(2, 2),
        generateCartProduct(3, 3),
        generateCartProduct(4, 4),
    ]

    products.forEach((product) => {
        cartAggregate.products = product
    })

    it('should return amount 4', () => {
        expect(cartAggregate.cartAmount()).toEqual(4)
    })

    it('should return total 4', () => {
        expect(cartAggregate.cartTotal()).toEqual(4)
    })

    it('should return cart IDs', () => {
        expect(cartAggregate.cartIds()).toEqual([1, 2, 3, 4])
    })

    it('should return cart IDs', () => {
        const orderId = 1
        const expected = products.map((product) => {
            return {
                orderId: orderId,
                productId: product.id,
                price: product.price,
                amount: product.amount,
            }
        })
        expect(cartAggregate.cartOrderProducts(orderId)).toEqual(expected)
    })
})


