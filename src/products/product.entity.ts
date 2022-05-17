import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNumber,
  // IsOptional,
  IsString,
  // IsUrl,
  IsUUID,
  Min,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { Document } from 'mongoose';
import * as MUUID from 'uuid-mongodb';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export type ProductDocument = ProductEntity & Document;

@Schema()
export class ProductEntity {
  @Exclude()
  _id: string;

  @IsUUID()
  @Expose()
  @Prop({ required: true, default: () => MUUID.v4() })
  uid: string;
  /**
  @IsUUID()
  @Prop({ required: true })
  category_uid: string;
 */

  @IsString({ message: ExceptionMessage.REQUIRED_PRODUCT_NAME })
  @Expose()
  @Prop({ required: true })
  name: string;

  @IsNumber({}, { message: ExceptionMessage.REQUIRED_PRODUCT_PRICE })
  @Min(0, { message: ExceptionMessage.MIN_PRODUCT_PRICE })
  @Expose()
  @Type(() => Number)
  @Prop({ default: 0 })
  price: number;

  /**
  @IsUrl({}, { message: ExceptionMessage.REQUIRED_PRODUCT_IMAGE_URL })
  @Prop({ required: true })
  image_url: string;

  @IsString()
  @IsOptional()
  @Prop({ required: false })
  description?: string; // 짧은 설명
  @IsUrl()
  @IsOptional()
  @Prop({ required: false })
  information_url?: string; // 상세 정보
   */
}

export const ProductSchemaProvider = {
  name: ProductEntity.name,
  schema: SchemaFactory.createForClass(ProductEntity),
};
