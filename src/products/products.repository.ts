import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { ProductDocument, ProductEntity } from './product.entity';
import {
  CreateProductDTO,
  FindOneProductDTO,
  ProductDetailEntity,
  ProductFilter,
  ProductSimpleEntitiy,
} from './products.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(ProductEntity.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findOne<T = ProductSimpleEntitiy | ProductDetailEntity>(
    dto: FindOneProductDTO,
    cls: ClassConstructor<T>,
  ): Promise<T> {
    const product = await this.productModel.findOne(dto);
    if (product) {
      return plainToInstance(cls, product.toObject(), {
        strategy: 'excludeAll',
      });
    } else {
      return undefined;
    }
  }

  async find<T = ProductSimpleEntitiy | ProductDetailEntity>(
    filter: Partial<ProductEntity>,
    cls: ClassConstructor<T>,
  ): Promise<T[]> {
    const products = (await this.productModel.find(filter)).map((product) =>
      product.toObject(),
    );
    return plainToInstance(cls, products, { strategy: 'excludeAll' });
  }

  async create(dto: CreateProductDTO): Promise<ProductDetailEntity> {
    const product = await this.productModel.create(dto);
    return plainToInstance(ProductDetailEntity, product.toObject(), {
      strategy: 'excludeAll',
    });
  }

  async deleteOne(filter: ProductFilter) {
    return this.productModel.deleteOne(filter);
  }
}
