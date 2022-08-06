import { HttpStatus } from "@nestjs/common";

export class ProductNotFoundError extends Error {
    public static STATUS_CODE = HttpStatus.NOT_FOUND
    public static ERROR_CODE = 'PRODUCT_00001'
    public static ERROR_MESSAGE = 'Product not found'
    public static RESPONSE = {
        error_code: ProductNotFoundError.ERROR_CODE,
        error_message: ProductNotFoundError.ERROR_MESSAGE
    }

    constructor(message = ProductNotFoundError.ERROR_MESSAGE) {
        super(message)
    }
}
