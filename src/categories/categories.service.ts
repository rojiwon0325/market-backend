import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { CategoriesRepository } from './categories.repository';
import {
  CategoryFilter,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './categories.dto';
import { Category } from './entities/category';
import { CategoryDocument, CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  find(filter?: FilterQuery<CategoryDocument>): Promise<Category[]> {
    return this.categoriesRepository.find({ filter, cls: Category });
  }
  async findOne(filter: FilterQuery<CategoryDocument>): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      filter,
      cls: Category,
    });
    if (category) {
      return category;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }
  async count(filter?: FilterQuery<CategoryDocument>): Promise<number> {
    return this.categoriesRepository.count(filter);
  }

  async create(data: CreateCategoryDTO): Promise<CategoryEntity> {
    const exist = await this.findOne({ filter: { name: data.name } });
    if (exist) {
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.USED_NAME,
      );
    } else {
      return this.categoriesRepository.create(data);
    }
  }

  async updateOne(
    filter: FilterQuery<CategoryEntity>,
    data: UpdateCategoryDTO,
  ): Promise<CategoryEntity> {
    if (data.name) {
      const exist = await this.categoriesRepository.findOne({
        filter: { name: data.name },
        cls: Category,
      });
      if (exist) {
        throw this.exceptionService.getBadRequestException(
          ExceptionMessage.USED_NAME,
        );
      }
    }
    const category = await this.categoriesRepository.updateOne({
      filter,
      data,
    });
    if (category) {
      return category;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }
  async deleteOne(filter: CategoryFilter): Promise<CategoryFilter> {
    const { deletedCount } = await this.categoriesRepository.deleteOne(filter);
    if (deletedCount) {
      return filter;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
    }
  }
}
