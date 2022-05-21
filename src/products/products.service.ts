import { ClassConstructor } from 'class-transformer';
import {
  CreateProductDTO,
  ProductDetailEntity,
  ProductFilter,
  ProductSimpleEntitiy,
  UpdateProductDTO,
} from './products.dto';
import { ProductsRepository } from './products.repository';
import { Injectable } from '@nestjs/common';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  async findAll<T = ProductSimpleEntitiy | ProductDetailEntity>(
    cls: ClassConstructor<T>,
  ) {
    return this.productsRepository.find({}, cls);
  }

  async find<T = ProductSimpleEntitiy | ProductDetailEntity>(
    filter: Partial<ProductEntity>,
    cls: ClassConstructor<T>,
  ) {
    return this.productsRepository.find(filter, cls);
  }

  async search(search: string): Promise<ProductSimpleEntitiy[]> {
    return this.productsRepository.search(search);
  }

  async findOne<T = ProductDetailEntity | ProductSimpleEntitiy>(
    filter: ProductFilter,
    cls: ClassConstructor<T>,
  ): Promise<T> {
    const product = await this.productsRepository.findOne(filter, cls);
    if (product) {
      return product;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_PRODUCT,
      );
    }
  }

  async create(dto: CreateProductDTO): Promise<ProductEntity> {
    const product = await this.productsRepository.create(dto);
    return product;
  }

  async updateOne(
    filter: ProductFilter,
    dto: UpdateProductDTO,
  ): Promise<ProductEntity> {
    const product = await this.productsRepository.updateOne(filter, dto);
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
