import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument, CategoryEntity } from './category.entity';
import { CategoryFilter, CategoryDTO } from './categories.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(CategoryEntity.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async find(): Promise<CategoryEntity[]> {
    const categories = (await this.categoryModel.find()).map((category) =>
      category.toObject(),
    );
    return plainToInstance(CategoryEntity, categories);
  }
  async findOne(
    dto: Pick<CategoryEntity, 'uid'> | Pick<CategoryEntity, 'name'>,
  ): Promise<CategoryEntity> {
    const category = await this.categoryModel.findOne(dto);
    if (category) {
      return plainToInstance(CategoryEntity, category.toObject());
    } else {
      return undefined;
    }
  }
  async create(dto: CategoryDTO): Promise<CategoryEntity> {
    const category = await this.categoryModel.create(dto);
    return plainToInstance(CategoryEntity, category.toObject());
  }
  async updateOne(
    filter: CategoryFilter,
    dto: CategoryDTO,
  ): Promise<CategoryEntity> {
    const category = await this.categoryModel.findOne(filter);
    if (category) {
      await this.categoryModel.updateOne(filter, dto);
      return plainToInstance(CategoryEntity, {
        ...category.toObject(),
        ...dto,
      });
    } else {
      return undefined;
    }
  }
  async deleteOne(filter: CategoryFilter) {
    return this.categoryModel.deleteOne(filter);
  }
}
