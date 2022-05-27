import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';
import { ProductSimple } from 'src/products/entities/product.simple';
import { ProductSimplesResponse } from 'src/products/products.dto';
import { ProductsService } from 'src/products/products.service';
import { UserRole } from 'src/users/entities/user-role';
import { Roles } from 'src/users/roles.decorator';
import {
  CategoriesResponse,
  CategoryIdParam,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './categories.dto';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Public()
  @Get()
  async find(): Promise<CategoriesResponse> {
    return {
      total: await this.categoriesService.count(),
      categories: await this.categoriesService.find(),
    };
  }

  @Public()
  @Get(':category_id/products')
  async findProducts(
    @Param() { category_id }: CategoryIdParam,
  ): Promise<ProductSimplesResponse> {
    return {
      total: await this.productsService.count({ category_id }),
      products: await this.productsService.find({
        filter: { category_id },
        cls: ProductSimple,
      }),
    };
  }

  @Roles(UserRole.Admin)
  @Post('create')
  create(@Body() body: CreateCategoryDTO): Promise<CategoryEntity> {
    return this.categoriesService.create(body);
  }

  @Roles(UserRole.Admin)
  @Post(':category_id/update')
  update(
    @Param() { category_id }: CategoryIdParam,
    @Body() body: UpdateCategoryDTO,
  ) {
    return this.categoriesService.updateOne({ uid: category_id }, body);
  }

  @Roles(UserRole.Admin)
  @Post(':category_id/delete')
  delete(@Param() { category_id }: CategoryIdParam) {
    return this.categoriesService.deleteOne({ uid: category_id });
  }
}
