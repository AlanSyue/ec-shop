import { OrderItem } from "../../entities/order-item.entity"
import { Order } from "../../entities/order.entity"
import { Product } from "../../entities/product.entity"
import { OrderInfo } from "./order-aggregate"

describe('OrderInfo', () => {
    it('should return object', () => {
        const orderItem = new OrderItem()
        const product = new Product()
        product.name = 'product name'
        orderItem.product = product

        const order = new Order()
        order.id = 1
        order.total = 1
        order.amount = 1
        order.orderItems = [orderItem]

        const orderInfo = new OrderInfo(
            order.id,
            order.total,
            order.amount,
            order.orderItems
        )

        const products = [orderItem].map((orderItem) => {
            return {
                id: orderItem.productId,
                name: orderItem.product.name,
                price: orderItem.price,
                amount: orderItem.amount,
            }
        })

        const expected = {
            id: order.id,
            total: order.total,
            amount: order.amount,
            items: products,
        }

        expect(orderInfo.toObject()).toEqual(expected)
    })
})
