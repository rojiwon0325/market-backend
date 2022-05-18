import { ProductEntity } from './product.entity';
import { OmitType, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

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
  'category_id',
  'name',
  'price',
]) {}

export class ProductIdParam {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  product_id: string;
}

export class ProductFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
}
