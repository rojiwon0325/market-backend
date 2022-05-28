import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/Public.decorator';
import { ProductSimple } from './products/entities/product.simple';
import { ProductsService } from './products/products.service';

@Public()
@Controller()
export class AppController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  default() {
    return 'Welcome To E-Market';
  }
  @Get('home')
  async home() {
    const products = await this.productsService.find({ cls: ProductSimple });
    return [
      {
        title: '이 상품 어때요?',
        products,
      },
      {
        title: '지금 가장 핫한 상품',
        products,
      },
    ];
  }
  @Get('health-check')
  check() {
    return 'Health Check is Successed';
  }
}
