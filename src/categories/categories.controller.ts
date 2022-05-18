import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';
import { ProductSimpleEntitiy } from 'src/products/products.dto';
import { ProductsService } from 'src/products/products.service';
import { CategoryDTO, CategoryIdParam } from './categories.dto';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './category.entity';

@Public()
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @Get(':category_id/products')
  findProducts(
    @Param() { category_id }: CategoryIdParam,
  ): Promise<ProductSimpleEntitiy[]> {
    return this.productsService.find({ category_id }, ProductSimpleEntitiy);
  }

  @Post('create')
  create(@Body() body: CategoryDTO): Promise<CategoryEntity> {
    return this.categoriesService.create(body);
  }

  @Post(':category_id/update')
  update(@Param() { category_id }: CategoryIdParam, @Body() body: CategoryDTO) {
    return this.categoriesService.update({ uid: category_id }, body);
  }

  @Post(':category_id/delete')
  delete(@Param() { category_id }: CategoryIdParam) {
    return this.categoriesService.deleteOne({ uid: category_id });
  }
}
