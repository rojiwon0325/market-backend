import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

/**
 * 취소/환불 요청 상태(진행상태)이거나 취소/환불 처리 상태
 */
export enum RefundStatus {
  Canceling = 'Canceling',
  Refunding = 'Refunding',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

export type RefundDocument = RefundEntity & Document;

@Schema()
export class RefundEntity {
  @Expose()
  _id: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true, unique: true })
  order_id: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true })
  customer_id: string;

  @IsEnum(RefundStatus, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true, type: String, enum: RefundStatus })
  status: RefundStatus;

  @IsString({ message: ExceptionMessage.VALIDATION })
  @IsOptional()
  @Prop({ required: false })
  reason?: string;
}

export const RefundSchemaProvider = {
  name: RefundEntity.name,
  schema: SchemaFactory.createForClass(RefundEntity),
};
