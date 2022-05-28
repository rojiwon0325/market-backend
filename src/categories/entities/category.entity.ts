import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose, Type } from 'class-transformer';
import * as MUUID from 'uuid-mongodb';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { Document } from 'mongoose';

export type CategoryDocument = CategoryEntity & Document;

@Schema()
export class CategoryEntity {
  @Exclude()
  _id: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Expose()
  @Prop({ required: true, default: () => MUUID.v4() })
  uid: string;

  @IsString({ message: ExceptionMessage.VALIDATION })
  @Type(() => String)
  @Expose()
  @Prop({ required: true, unique: true })
  name: string;

  @IsUrl({ message: ExceptionMessage.VALIDATION })
  @IsOptional()
  @Expose()
  @Prop({ required: false })
  image_url?: string;
}

export const CategorySchemaProvider = {
  name: CategoryEntity.name,
  schema: SchemaFactory.createForClass(CategoryEntity),
};
