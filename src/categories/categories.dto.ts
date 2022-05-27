import { PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, ValidateNested } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { Category } from './entities/category';
import { CategoryEntity } from './entities/category.entity';

export class CategoryFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
}

export class CategoryIdParam {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  category_id: string;
}

export class CategoriesResponse {
  @IsInt()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];
}

export class CreateCategoryDTO extends PickType(CategoryEntity, [
  'name',
  'image_url',
]) {}

export class UpdateCategoryDTO extends PickType(PartialType(CategoryEntity), [
  'name',
  'image_url',
]) {}
