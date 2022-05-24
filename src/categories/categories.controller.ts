import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';
import {
  ProductSimpleEntity,
  ProductsResponse,
} from 'src/products/products.dto';
import { ProductsService } from 'src/products/products.service';
import { Roles } from 'src/users/roles.decorator';
import { UserRole } from 'src/users/user.entity';
import {
  CategoriesResponse,
  CategoryDTO,
  CategoryIdParam,
} from './categories.dto';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Public()
  @Get()
  async findAll(): Promise<CategoriesResponse> {
    return {
      total: await this.categoriesService.count(),
      categories: await this.categoriesService.findAll(),
    };
  }

  @Public()
  @Get(':category_id/products')
  async findProducts(
    @Param() { category_id }: CategoryIdParam,
  ): Promise<ProductsResponse> {
    return {
      total: await this.productsService.count({ category_id }),
      products: await this.productsService.find(
        { category_id },
        ProductSimpleEntity,
      ),
    };
  }

  @Roles(UserRole.Admin)
  @Post('create')
  create(@Body() body: CategoryDTO): Promise<CategoryEntity> {
    return this.categoriesService.create(body);
  }

  @Roles(UserRole.Admin)
  @Post(':category_id/update')
  update(@Param() { category_id }: CategoryIdParam, @Body() body: CategoryDTO) {
    return this.categoriesService.updateOne({ uid: category_id }, body);
  }

  @Roles(UserRole.Admin)
  @Post(':category_id/delete')
  delete(@Param() { category_id }: CategoryIdParam) {
    return this.categoriesService.deleteOne({ uid: category_id });
  }
}
