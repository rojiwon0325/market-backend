import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Document } from 'mongoose';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { RefundStatus } from './refund-status';

export type RefundDocument = RefundEntity & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
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

  @IsBoolean({ message: ExceptionMessage.VALIDATION })
  @Type(() => Boolean)
  @Expose()
  @Prop({ required: true, default: true })
  visible: boolean;

  @IsDate()
  @Expose()
  created_at: Date;

  @IsDate()
  @Expose()
  updated_at: Date;
}

export const RefundSchemaProvider = {
  name: RefundEntity.name,
  schema: SchemaFactory.createForClass(RefundEntity),
};
