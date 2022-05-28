import { CategoriesService } from './categories.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchemaProvider } from './entities/category.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([CategorySchemaProvider]),
    ProductsModule,
  ],
  providers: [CategoriesService, CategoriesRepository],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
