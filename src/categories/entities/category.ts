import { OmitType } from '@nestjs/swagger';
import { CategoryEntity } from './category.entity';

export class Category extends OmitType(CategoryEntity, ['_id']) {}
