import { IsOptional } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  take: number;

  @IsOptional()
  skip: number;
}
