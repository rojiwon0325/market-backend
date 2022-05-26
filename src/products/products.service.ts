import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { FindOneParameter, FindParameter } from 'src/interfaces/repository';
import { ProductDetail } from './entities/product.detail';
import { ProductDocument, ProductEntity } from './entities/product.entity';
import { ProductSimple } from './entities/product.simple';
import {
  CreateProductDTO,
  ProductFilter,
  UpdateProductDTO,
} from './products.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  find<T = ProductEntity | ProductSimple | ProductDetail>(
    parameter: FindParameter<ProductEntity, T>,
  ): Promise<T[]> {
    return this.productsRepository.find(parameter);
  }

  async findOne<T = ProductEntity | ProductSimple | ProductDetail>(
    parameter: FindOneParameter<ProductEntity, T>,
  ): Promise<T> {
    const product = await this.productsRepository.findOne(parameter);
    if (product) {
      return product;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_USER,
      );
    }
  }
  count(filter?: FilterQuery<ProductDocument>): Promise<number> {
    return this.productsRepository.count(filter);
  }
  create(data: CreateProductDTO): Promise<ProductEntity> {
    return this.productsRepository.create(data);
  }
  async updateOne(
    filter: ProductFilter,
    data: UpdateProductDTO,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.updateOne({ filter, data });
    if (product) {
      return product;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_PRODUCT,
      );
    }
  }
  async deleteOne(filter: ProductFilter): Promise<ProductFilter> {
    const { deletedCount } = await this.productsRepository.deleteOne(filter);
    if (deletedCount) {
      return filter;
    } else
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
  }
}
