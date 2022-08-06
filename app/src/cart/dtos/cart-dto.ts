import { IsNotEmpty, IsInt } from 'class-validator';

export type CartProduct = {
  id: number;
  cartId: number;
  name: string;
  total: number;
  amount: number;
  price: number;
  inventory: number;
};

export class CartDto {
  @IsInt()
  @IsNotEmpty()
  amount: number;
}
