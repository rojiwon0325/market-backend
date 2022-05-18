import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchemaProvider } from './entities/order.entity';
import { OrderItemSchemaProvider } from './entities/order-item.entity';
import { OrdersRepository } from './orders.repository';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([OrderSchemaProvider, OrderItemSchemaProvider]),
    ProductsModule,
  ],
  providers: [OrdersService, OrdersRepository],
  controllers: [OrdersController],
})
export class OrdersModule {}
