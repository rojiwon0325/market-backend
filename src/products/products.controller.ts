import {
  CreateProductDTO,
  ProductDetailEntity,
  ProductFilter,
  ProductIdParam,
  ProductSimpleEntitiy,
  SearchQuery,
  UpdateProductDTO,
} from './products.dto';
import { ProductsService } from './products.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';
import { UploadService } from 'src/upload/upload.service';
import { UploadType } from 'src/upload/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductEntity } from './product.entity';

@Public()
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  find(): Promise<ProductSimpleEntitiy[]> {
    return this.productsService.findAll(ProductSimpleEntitiy);
  }

  @Get('search')
  search(@Query() { keyword }: SearchQuery): Promise<ProductSimpleEntitiy[]> {
    return this.productsService.search(keyword);
  }

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
  @UseInterceptors(FileInterceptor(UploadType.Image))
  async create(
    @Body() body: CreateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductEntity> {
    const product = await this.productsService.create(body);
    if (file) {
      const image_url = await this.uploadService.upload({
        type: UploadType.Image,
        filename: product.uid,
        file,
      });
      return this.productsService.updateOne(
        { uid: product.uid },
        { image_url },
      );
    }
    return product;
  }

  @Post(':product_id/update')
  @UseInterceptors(FileInterceptor(UploadType.Image))
  async update(
    @Param() { product_id }: ProductIdParam,
    @Body() body: UpdateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductEntity> {
    const product = await this.productsService.findOne(
      { uid: product_id },
      ProductDetailEntity,
    );
    if (file) {
      // 이름이 상품의 uid임으로 기존 파일이 존재해도 덮어쓸 것임
      // 만약 나중에 여러 사진을 매핑하려면 uuid처럼 사진마다 고유한 이름 부여 필요
      const image_url = await this.uploadService.upload({
        type: UploadType.Image,
        filename: product.uid,
        file,
      });
      return this.productsService.updateOne(
        { uid: product_id },
        { ...body, image_url },
      );
    }
    return this.productsService.updateOne({ uid: product_id }, body);
  }

  @Post(':product_id/delete')
  async delete(
    @Param() { product_id }: ProductIdParam,
  ): Promise<ProductFilter> {
    const product = await this.productsService.findOne(
      { uid: product_id },
      ProductDetailEntity,
    );
    if (product.image_url) {
      await this.uploadService.delete({
        type: UploadType.Image,
        filename: product.uid,
      });
    }
    return this.productsService.deleteOne({ uid: product_id });
  }
}
