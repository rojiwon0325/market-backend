import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Document } from 'mongoose';
import * as MUUID from 'uuid-mongodb';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export enum OrderStatus {
  Pending = 'Pending',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

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

  @IsEnum(OrderStatus)
  @Expose()
  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

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
