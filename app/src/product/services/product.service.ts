import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductNotFoundError } from '../errors/product-not-found-error';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async findAll(take: number, skip: number) {
    const productData = await this.productRepository.findAndCount({
      take,
      skip,
    });

    const products = productData[0].map((product) => {
      return product.toObject();
    });

    return {
      products: products,
      total: productData[1],
    };
  }

  public async find(id: number) {
    const product = await this.productRepository.findOneBy({ id: id });

    if (!product) {
      throw new ProductNotFoundError();
    }

    return await product.toObject();
  }
}
