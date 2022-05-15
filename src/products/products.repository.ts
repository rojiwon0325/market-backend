import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDocument, ProductEntity } from './product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(ProductEntity.name)
    private productModel: Model<ProductDocument>,
  ) {}
}
