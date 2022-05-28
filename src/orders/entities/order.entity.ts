import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Document } from 'mongoose';
import * as MUUID from 'uuid-mongodb';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { OrderStatus } from './order-status';
import { RefundStatus } from 'src/refunds/entities/refund-status';

export type OrderDocument = OrderEntity & Document;

@Schema({ timestamps: { createdAt: 'ordered_at', updatedAt: 'updated_at' } })
export class OrderEntity {
  @Expose()
  _id: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true, default: () => MUUID.v4() })
  uid: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @IsOptional()
  @Expose()
  @Prop({ required: false })
  customer_id: string;

  @IsNumber({}, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true, default: 0 })
  total_price: number;

  @IsEnum([OrderStatus, RefundStatus])
  @Expose()
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus | RefundStatus;

  @IsBoolean({ message: ExceptionMessage.VALIDATION })
  @Type(() => Boolean)
  @Expose()
  @Prop({ required: true, default: true })
  visible: boolean;

  @IsDate()
  @Expose()
  ordered_at: Date;

  @IsDate()
  @Expose()
  updated_at: Date;
}

export const OrderSchemaProvider = {
  name: OrderEntity.name,
  schema: SchemaFactory.createForClass(OrderEntity),
};
