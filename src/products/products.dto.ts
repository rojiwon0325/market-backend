import { PartialType, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { ProductEntity } from './entities/product.entity';
import { ProductSimple } from './entities/product.simple';

export class ProductIdParam {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  product_id: string;
}

export class ProductFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
}
export class SearchQuery {
  @IsString()
  @Type(() => String)
  keyword: string;
}

export class CreateProductDTO extends PickType(ProductEntity, [
  'category_id',
  'name',
  'price',
]) {}

export class UpdateProductDTO extends PickType(PartialType(ProductEntity), [
  'category_id',
  'description',
  'image_url',
  'name',
  'price',
]) {}

export class ProductSimplesResponse {
  @IsNumber()
  @Expose()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => ProductSimple)
  @Expose()
  products: ProductSimple[];
}
export class ProductEntitiesResponse {
  @IsNumber()
  @Expose()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => ProductEntity)
  @Expose()
  products: ProductEntity[];
}
