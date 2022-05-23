import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FilterQuery, Model } from 'mongoose';
import { ProductDocument, ProductEntity } from './product.entity';
import {
  CreateProductDTO,
  ProductDetailEntity,
  ProductFilter,
  ProductSimpleEntitiy,
  ProductsResponse,
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

  async search(search: string): Promise<ProductsResponse> {
    const regex = new RegExp(`\\b${search.split(' ').join('|')}\\b`, 'ig');
    const products = (
      await this.productModel.find({
        name: {
          $regex: regex,
        },
      })
    ).map((product) => product.toObject());
    const total = await this.count({
      name: {
        $regex: regex,
      },
    });
    const response = {
      total,
      products,
    };
    return plainToInstance(ProductsResponse, response, {
      strategy: 'excludeAll',
    });
  }

  async count(filter: FilterQuery<ProductDocument>): Promise<number> {
    return this.productModel.count(filter);
  }

  async create(dto: CreateProductDTO): Promise<ProductEntity> {
    const product = await this.productModel.create(dto);
    return plainToInstance(ProductEntity, product.toObject(), {
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
