import { Controller, Get, UseGuards, Req, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
import { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
    constructor(
        private service: OrderService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async findAll(@Req() req) {
        try {
            const userId = req.user.id
            
            const ordersInfo = (await this.service.findAll(userId))
                .map((orderInfo) => {
                    return orderInfo.toObject()
                })

            return { data: ordersInfo }
        } catch (error) {
            throw error
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async find(@Req() req, @Param('id') orderId: number) {
        try {
            const userId = req.user.id
            const orderInfo = await this.service.find(userId, orderId)

            return { data: orderInfo.toObject()}
        } catch (error) {
            throw error
        }
    }
}
