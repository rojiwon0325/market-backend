import { Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

export class CategoryDTO {
  @IsString()
  @Type(() => String)
  name: string;
}

export class CategoryIdParam {
  @IsUUID()
  category_id: string;
}

export class CategoryFilter {
  @IsUUID()
  uid: string;
}
