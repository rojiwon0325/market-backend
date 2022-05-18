import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import * as MUUID from 'uuid-mongodb';
import { IsString, IsUUID } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export type CategoryDocument = CategoryEntity & Document;

@Schema()
export class CategoryEntity {
  @Exclude()
  _id: string;

  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  @Prop({ required: true, default: () => MUUID.v4() })
  uid: string;

  @IsString({ message: ExceptionMessage.VALIDATION })
  @Type(() => String)
  @Prop({ required: true, unique: true })
  name: string;
}

export const CategorySchemaProvider = {
  name: CategoryEntity.name,
  schema: SchemaFactory.createForClass(CategoryEntity),
};
