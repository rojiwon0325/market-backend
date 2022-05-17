import {
  CreateProductDTO,
  DeleteProductDTO,
  ProductDetailEntity,
  ProductIdParamDTO,
  ProductSimpleEntitiy,
} from './products.dto';
import { ProductsService } from './products.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';

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
    @Param() { product_id }: ProductIdParamDTO,
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

  @Post('delete')
  delete(@Body() body: DeleteProductDTO): Promise<DeleteProductDTO> {
    return this.productsService.delete(body);
  }
}