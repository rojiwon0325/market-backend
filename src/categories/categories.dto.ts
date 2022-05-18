import { Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export class CategoryDTO {
  @IsString({ message: ExceptionMessage.VALIDATION })
  @Type(() => String)
  name: string;
}

export class CategoryIdParam {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  category_id: string;
}

export class CategoryFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
}
