import { ProductEntity } from './product.entity';
import { OmitType, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

export class ProductSimpleEntitiy extends PickType(ProductEntity, [
  'uid',
  'name',
  'price',
  //'image_url',
]) {}

export class ProductDetailEntity extends OmitType(ProductEntity, [
  '_id',
  'category_id',
]) {
  @Exclude()
  _id: string;

  @Exclude()
  category_id: string;
}

export class FindOneProductDTO extends PickType(ProductEntity, ['uid']) {}

export class CreateProductDTO extends PickType(ProductEntity, [
  'name',
  'price',
]) {}

export class DeleteProductDTO extends PickType(ProductEntity, ['uid']) {}

export class ProductIdParamDTO {
  @IsUUID()
  @Type(() => String)
  product_id: string;
}
