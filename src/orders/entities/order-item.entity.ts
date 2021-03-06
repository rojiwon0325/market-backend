import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';
import { Document } from 'mongoose';
import * as MUUID from 'uuid-mongodb';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export type OrderItemDocument = OrderItemEntity & Document;

@Schema()
export class OrderItemEntity {
  @Expose()
  _id: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true, default: () => MUUID.v4() })
  uid: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true })
  order_id: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true })
  product_id: string;

  @IsString({ message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true })
  product_name: string;

  @IsNumber({}, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Type(() => Number)
  @Prop({ required: true })
  product_price: number;

  @IsUrl({}, { message: ExceptionMessage.VALIDATION })
  @IsOptional()
  @Prop({ required: false })
  product_image_url?: string;

  @IsInt({ message: ExceptionMessage.VALIDATION })
  @Min(1)
  @Expose()
  @Type(() => Number)
  @Prop({ required: true })
  count: number;
}

export const OrderItemSchemaProvider = {
  name: OrderItemEntity.name,
  schema: SchemaFactory.createForClass(OrderItemEntity),
};
