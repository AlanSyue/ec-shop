import { CartService } from '../services/cart.service';
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/strategies/jwt-auth.guard';
import { CartDto } from '../dtos/cart-dto';
import { OrderService } from '../../order/services/order.service';

@Controller('cart')
export class CartController {
  constructor(
    private service: CartService,
    private orderService: OrderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async findCart(@Req() req) {
    try {
      const userId = req.user.id;
      const cartProducts = await this.service.findCart(userId);

      return {
        data: cartProducts,
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(@Req() req) {
    try {
      const userId = req.user.id;
      const orderId = await this.service.checkout(userId);
      const orderInfo = await this.orderService.find(userId, orderId);

      return { data: orderInfo.toObject() };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  async addToCart(
    @Req() req,
    @Param('productId') productId: number,
    @Body() cartDto: CartDto,
  ) {
    try {
      const userId = req.user.id;
      await this.service.addToCart(userId, productId, cartDto.amount);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  async removeFromCart(
    @Req() req,
    @Param('productId') productId: number,
    @Body() cartDto: CartDto,
  ) {
    try {
      const userId = req.user.id;
      await this.service.removeFromCart(userId, productId, cartDto.amount);
    } catch (error) {
      throw error;
    }
  }
}
