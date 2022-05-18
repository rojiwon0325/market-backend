import { CategoriesRepository } from './categories.repository';
import { Injectable } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { CategoryFilter, CategoryDTO } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find();
  }

  async findOne(dto: CategoryFilter): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.findOne(dto);
    if (category) {
      return category;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }

  async create(dto: CategoryDTO): Promise<CategoryEntity> {
    const exist = await this.categoriesRepository.findOne(dto);
    if (exist) {
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.USED_NAME,
      );
    } else {
      return this.categoriesRepository.create(dto);
    }
  }

  async update(
    filter: CategoryFilter,
    dto: CategoryDTO,
  ): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.findOne(filter);
    const exist = await this.categoriesRepository.findOne(dto);
    if (exist) {
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.USED_NAME,
      );
    } else if (category) {
      return this.categoriesRepository.updateOne(filter, dto);
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }

  async deleteOne(filter: CategoryFilter): Promise<CategoryFilter> {
    const { deletedCount } = await this.categoriesRepository.deleteOne(filter);
    if (deletedCount > 0) {
      return filter;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
    }
  }
}