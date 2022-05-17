import { ClassConstructor } from 'class-transformer';
import {
  CreateProductDTO,
  DeleteProductDTO,
  FindOneProductDTO,
  ProductDetailEntity,
  ProductSimpleEntitiy,
} from './products.dto';
import { ProductsRepository } from './products.repository';
import { Injectable } from '@nestjs/common';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  async findAll<T = ProductSimpleEntitiy | ProductDetailEntity>(
    cls: ClassConstructor<T>,
  ) {
    return this.productsRepository.findAll(cls);
  }

  async findOne<T = ProductDetailEntity | ProductSimpleEntitiy>(
    dto: FindOneProductDTO,
    cls: ClassConstructor<T>,
  ): Promise<T> {
    const product = await this.productsRepository.findOne(dto, cls);
    if (product) {
      return product;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_PRODUCT,
      );
    }
  }

  async create(dto: CreateProductDTO): Promise<ProductDetailEntity> {
    const product = await this.productsRepository.create(dto);
    return product;
  }

  async delete(dto: DeleteProductDTO): Promise<DeleteProductDTO> {
    const { deletedCount } = await this.productsRepository.deleteOne(dto);
    if (deletedCount) {
      return dto;
    } else
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
  }
}
