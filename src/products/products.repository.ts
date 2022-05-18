import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { ProductDocument, ProductEntity } from './product.entity';
import {
  CreateProductDTO,
  ProductDetailEntity,
  ProductFilter,
  ProductSimpleEntitiy,
  UpdateProductDTO,
} from './products.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(ProductEntity.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async findOne<T = ProductSimpleEntitiy | ProductDetailEntity>(
    filter: ProductFilter,
    cls: ClassConstructor<T>,
  ): Promise<T> {
    const product = await this.productModel.findOne(filter);
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

  async search(search: string): Promise<ProductSimpleEntitiy[]> {
    const products = (
      await this.productModel.find({
        name: {
          $regex: new RegExp(`\\b${search.split(' ').join('|')}\\b`, 'ig'),
        },
      })
    ).map((product) => product.toObject());
    return plainToInstance(ProductSimpleEntitiy, products, {
      strategy: 'excludeAll',
    });
  }

  async create(dto: CreateProductDTO): Promise<ProductDetailEntity> {
    const product = await this.productModel.create(dto);
    return plainToInstance(ProductDetailEntity, product.toObject(), {
      strategy: 'excludeAll',
    });
  }

  async updateOne(
    filter: ProductFilter,
    dto: UpdateProductDTO,
  ): Promise<ProductEntity> {
    const category = await this.productModel.findOne(filter);
    if (category) {
      await this.productModel.updateOne(filter, dto);
      return plainToInstance(
        ProductEntity,
        {
          ...category.toObject(),
          ...dto,
        },
        { strategy: 'excludeAll' },
      );
    } else {
      return undefined;
    }
  }

  async deleteOne(filter: ProductFilter) {
    return this.productModel.deleteOne(filter);
  }
}
