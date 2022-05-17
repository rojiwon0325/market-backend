import { ProductEntity } from './product.entity';
import { PickType } from '@nestjs/swagger';

export class ProductSimpleEntitiy extends PickType(ProductEntity, [
  'uid',
  'name',
  'price',
  //'image_url',
]) {}

export class ProductDetailEntity extends ProductEntity {}

export class FindOneProductDTO extends PickType(ProductEntity, ['uid']) {}

export class CreateProductDTO extends PickType(ProductEntity, [
  'name',
  'price',
]) {}
