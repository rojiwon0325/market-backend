import { OmitType } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';

export class ProductDetail extends OmitType(ProductEntity, [
  '_id',
  'category_id',
]) {}
