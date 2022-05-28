import { RefundsRepository } from './refunds.repository';
import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefundSchemaProvider } from './entities/refund.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { RefundsController } from './refunds.controller';

@Module({
  imports: [MongooseModule.forFeature([RefundSchemaProvider]), OrdersModule],
  providers: [RefundsRepository, RefundsService],
  controllers: [RefundsController],
})
export class RefundsModule {}
