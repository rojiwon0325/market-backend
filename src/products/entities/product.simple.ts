import { PickType } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';

export class ProductSimple extends PickType(ProductEntity, [
  'uid',
  'name',
  'price',
  'image_url',
]) {}
