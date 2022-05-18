import {
  CreateProductDTO,
  ProductDetailEntity,
  ProductFilter,
  ProductIdParam,
  ProductSimpleEntitiy,
  UpdateProductDTO,
} from './products.dto';
import { ProductsService } from './products.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';

@Public()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  find(): Promise<ProductSimpleEntitiy[]> {
    return this.productsService.findAll(ProductSimpleEntitiy);
  }

  @Public()
  @Get(':product_id')
  findOne(
    @Param() { product_id }: ProductIdParam,
  ): Promise<ProductDetailEntity> {
    return this.productsService.findOne(
      { uid: product_id },
      ProductDetailEntity,
    );
  }

  @Post('create')
  create(@Body() body: CreateProductDTO): Promise<ProductDetailEntity> {
    return this.productsService.create(body);
  }

  @Post(':product_id/update')
  update(
    @Param() { product_id }: ProductIdParam,
    @Body() body: UpdateProductDTO,
  ) {
    return this.productsService.updateOne({ uid: product_id }, body);
  }

  @Post(':product_id/delete')
  delete(@Param() { product_id }: ProductIdParam): Promise<ProductFilter> {
    return this.productsService.deleteOne({ uid: product_id });
  }
}
