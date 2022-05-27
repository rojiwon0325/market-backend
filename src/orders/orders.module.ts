import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { RefundsModule } from 'src/refunds/refunds.module';
import { OrderItemSchemaProvider } from './entities/order-item.entity';
import { OrderSchemaProvider } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([OrderSchemaProvider, OrderItemSchemaProvider]),
    ProductsModule,
    RefundsModule,
  ],
  providers: [OrdersService, OrdersRepository],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
