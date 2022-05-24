import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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
    return plainToInstance(CategoryEntity, categories, {
      strategy: 'excludeAll',
    });
  }
  async findOne(filter: CategoryDTO | CategoryFilter): Promise<CategoryEntity> {
    const category = await this.categoryModel.findOne(filter);
    if (category) {
      return plainToInstance(CategoryEntity, category.toObject(), {
        strategy: 'excludeAll',
      });
    } else {
      return undefined;
    }
  }
  async count(filter: FilterQuery<CategoryDocument>): Promise<number> {
    return this.categoryModel.count(filter);
  }

  async create(dto: CategoryDTO): Promise<CategoryEntity> {
    const category = await this.categoryModel.create(dto);
    return plainToInstance(CategoryEntity, category.toObject(), {
      strategy: 'excludeAll',
    });
  }
  async updateOne(
    filter: CategoryFilter,
    dto: CategoryDTO,
  ): Promise<CategoryEntity> {
    const category = await this.categoryModel.findOne(filter);
    if (category) {
      await this.categoryModel.updateOne(filter, dto);
      return plainToInstance(
        CategoryEntity,
        {
          ...category.toObject(),
          ...dto,
        },
        { strategy: 'excludeAll' },
      );
    } else {
      return undefined;
    }
  }
  async deleteOne(filter: CategoryFilter) {
    return this.categoryModel.deleteOne(filter);
  }
}
