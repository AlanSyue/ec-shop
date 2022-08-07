import { Controller, Get, UseGuards, Req, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
import { InvalidOrderError } from '../errors/invalid-order-error';
import { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
  constructor(private service: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async findAll(@Req() req) {
    try {
      const userId = req.user.id;

      const ordersInfo = (await this.service.findAll(userId)).map(
        (orderInfo) => {
          return orderInfo.toObject();
        },
      );

      return { data: ordersInfo };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async find(
    @Res({ passthrough: true }) res: Response,
    @Req() req,
    @Param('id') orderId: number,
  ) {
    try {
      const userId = req.user.id;
      const orderInfo = await this.service.find(userId, orderId);

      return { data: orderInfo.toObject() };
    } catch (error) {
      if (error instanceof InvalidOrderError) {
        res.status(InvalidOrderError.STATUS_CODE)
        return res.json(error.getResponse());
      }

      throw error;
    }
  }
}
