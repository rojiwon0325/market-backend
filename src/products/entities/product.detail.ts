import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ProductEntity } from './product.entity';

export class ProductDetail extends OmitType(ProductEntity, [
  '_id',
  'category_id',
]) {
  @Exclude()
  _id: string;

  @Exclude()
  category_id: string;
}
