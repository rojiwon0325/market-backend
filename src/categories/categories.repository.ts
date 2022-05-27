import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BaseRepository,
  FindOneParameter,
  FindParameter,
} from 'src/interfaces/repository';
import { CategoryDocument, CategoryEntity } from './entities/category.entity';
import { Category } from './entities/category';

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryEntity> {
  constructor(
    @InjectModel(CategoryEntity.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(categoryModel, CategoryEntity);
  }

  async find<T = Category>(
    parameter: FindParameter<CategoryEntity, T>,
  ): Promise<T[]> {
    return super.find(parameter);
  }
  findOne<T = Category>(
    parameter: FindOneParameter<CategoryEntity, T>,
  ): Promise<T> {
    return super.findOne(parameter);
  }
}
