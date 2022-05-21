import { ProductsRepository } from './products.repository';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchemaProvider } from './product.entity';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [MongooseModule.forFeature([ProductSchemaProvider]), UploadModule],
  providers: [ProductsService, ProductsRepository],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
