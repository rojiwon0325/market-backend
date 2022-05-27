import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { RefundStatus } from './refund-status';

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
