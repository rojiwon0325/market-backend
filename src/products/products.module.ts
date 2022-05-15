import { ProductsRepository } from './products.repository';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchemaProvider } from './product.entity';

@Module({
  imports: [MongooseModule.forFeature([ProductSchemaProvider])],
  providers: [ProductsService, ProductsRepository],
  controllers: [ProductsController],
})
export class ProductsModule {}
