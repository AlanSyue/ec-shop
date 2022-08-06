import { HttpStatus } from "@nestjs/common";

export class ProductOutOfStockError extends Error {
    public static STATUS_CODE = HttpStatus.BAD_REQUEST
    public static ERROR_CODE = 'CHECKOUT_00001'
    public static ERROR_MESSAGE = 'product out of stock'

    constructor(productName: string = null, message = ProductOutOfStockError.ERROR_MESSAGE) {
        if (productName) {
            message = `${productName} ${message}`
        }
        super(message)
    }

    public getResponse() {
        return {
            error_code: ProductOutOfStockError.ERROR_CODE,
            error_message: this.message
        }
    }
}
