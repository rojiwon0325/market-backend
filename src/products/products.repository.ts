import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FilterQuery, Model } from 'mongoose';
import { ProductDocument, ProductEntity } from './product.entity';
import { ProductDetailEntity, ProductSimpleEntitiy } from './products.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(ProductEntity.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findOne<T = ProductSimpleEntitiy | ProductDetailEntity>(
    dto: Partial<ProductEntity>,
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

  async findAll<T = ProductSimpleEntitiy | ProductDetailEntity>(
    cls: ClassConstructor<T>,
  ) {
    const products = (await this.productModel.find()).map((product) =>
      product.toObject(),
    );

    return plainToInstance(cls, products, { strategy: 'excludeAll' });
  }

  async create(dto: Partial<ProductEntity>): Promise<ProductDetailEntity> {
    const product = await this.productModel.create(dto);
    return plainToInstance(ProductDetailEntity, product.toObject(), {
      strategy: 'excludeAll',
    });
  }

  async deleteOne(filter: FilterQuery<ProductDocument>) {
    return this.productModel.deleteOne(filter);
  }
}
