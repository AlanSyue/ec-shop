import { ProductService } from '../services/product.service';
import { Controller, Get, Res, HttpCode, HttpStatus, Query, Param } from '@nestjs/common';
import { Response } from 'express'
import { ProductQueryDto } from '../dtos/product-query-dto';
import { ProductNotFoundError } from '../errors/product-not-found-error';

@Controller('product')
export class ProductController {
    constructor(
        private service: ProductService
    ) { }

    @Get('')
    async findAll(@Query() query: ProductQueryDto) {
        try {
            const take = query.take | 10
            const skip = query.skip | 0

            const data = await this.service.findAll(take, skip)

            return {
                data: data.products,
                total: data.total,
                take: take,
                skip: skip
            }
        } catch (error) {
            throw error
        }
    }

    @Get(':id')
    async find(@Res({ passthrough: true }) res: Response, @Param('id') id: number) {
        try {
            const product = await this.service.find(id)

            return res.send({
                data: product
            })
        } catch (error) {
            if (error instanceof ProductNotFoundError) {
                return res.status(ProductNotFoundError.STATUS_CODE).send(ProductNotFoundError.RESPONSE)
            }

            throw error
        }
    }
}
