import { ProductDetail } from './entities/product.detail';
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
import { UserRole } from 'src/users/entities/user-role';
import { Roles } from 'src/users/roles.decorator';
import { ProductEntity } from './entities/product.entity';
import { ProductSimple } from './entities/product.simple';
import {
  CreateProductDTO,
  ProductEntitiesResponse,
  ProductFilter,
  ProductIdParam,
  ProductSimplesResponse,
  SearchQuery,
  UpdateProductDTO,
} from './products.dto';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadType } from 'src/upload/upload.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly uploadService: UploadService,
  ) {}

  @Roles(UserRole.Admin)
  @Get('all')
  async find_admin(): Promise<ProductEntitiesResponse> {
    return {
      total: await this.productsService.count(),
      products: await this.productsService.find({ cls: ProductEntity }),
    };
  }

  @Public()
  @Get('search')
  async search(
    @Query() { keyword }: SearchQuery,
  ): Promise<ProductSimplesResponse> {
    const $regex = new RegExp(`\\b${keyword.split(' ').join('|')}\\b`, 'ig');
    return {
      total: await this.productsService.count({ name: { $regex } }),
      products: await this.productsService.find({
        filter: { name: { $regex } },
        cls: ProductSimple,
      }),
    };
  }

  @Public()
  @Get(':product_id')
  findOne(@Param() { product_id }: ProductIdParam): Promise<ProductDetail> {
    return this.productsService.findOne({
      filter: { uid: product_id },
      cls: ProductDetail,
    });
  }

  @Roles(UserRole.Admin)
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

  @Roles(UserRole.Admin)
  @Post(':product_id/update')
  @UseInterceptors(FileInterceptor(UploadType.Image))
  async update(
    @Param() { product_id }: ProductIdParam,
    @Body() body: UpdateProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductEntity> {
    const product = await this.productsService.findOne({
      filter: { uid: product_id },
      cls: ProductDetail,
    });
    if (file) {
      const image_url = await this.uploadService.upload({
        type: UploadType.Image,
        filename: product.uid,
        file,
      });
      if (product.image_url) {
        await this.uploadService.delete({
          file_url: product.image_url,
        });
      }
      return this.productsService.updateOne(
        { uid: product_id },
        { ...body, image_url },
      );
    }
    return this.productsService.updateOne({ uid: product_id }, body);
  }

  @Roles(UserRole.Admin)
  @Post(':product_id/delete')
  async delete(
    @Param() { product_id }: ProductIdParam,
  ): Promise<ProductFilter> {
    const product = await this.productsService.findOne({
      filter: { uid: product_id },
      cls: ProductDetail,
    });
    if (product.image_url) {
      await this.uploadService.delete({
        file_url: product.image_url,
      });
    }
    return this.productsService.deleteOne({ uid: product_id });
  }
}
