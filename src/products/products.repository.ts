import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BaseRepository,
  FindOneParameter,
  FindParameter,
} from 'src/interfaces/repository';
import { ProductDetail } from './entities/product.detail';
import { ProductDocument, ProductEntity } from './entities/product.entity';
import { ProductSimple } from './entities/product.simple';

@Injectable()
export class ProductsRepository extends BaseRepository<ProductEntity> {
  constructor(
    @InjectModel(ProductEntity.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel, ProductEntity);
  }

  find<T = ProductEntity | ProductSimple | ProductDetail>(
    parameter: FindParameter<ProductEntity, T>,
  ): Promise<T[]> {
    return super.find(parameter);
  }
  findOne<T = ProductEntity | ProductSimple | ProductDetail>(
    parameter: FindOneParameter<ProductEntity, T>,
  ): Promise<T> {
    return super.findOne(parameter);
  }
}
