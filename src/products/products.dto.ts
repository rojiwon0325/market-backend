import { ProductEntity } from './product.entity';
import { OmitType, PickType } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export class ProductSimpleEntitiy extends PickType(ProductEntity, [
  'uid',
  'name',
  'price',
  'image_url',
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

export class CreateProductDTO extends PickType(ProductEntity, [
  'category_id',
  'name',
  'price',
]) {}

export class UpdateProductDTO {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  name?: string;

  @IsUUID()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;
}

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

export class ProductsResponse {
  @IsString()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => ProductSimpleEntitiy)
  products: ProductSimpleEntitiy[];
}
