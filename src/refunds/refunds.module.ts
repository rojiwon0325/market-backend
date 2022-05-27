import { RefundsRepository } from './refunds.repository';
import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RefundSchemaProvider } from './entities/refund.entity';

@Module({
  imports: [MongooseModule.forFeature([RefundSchemaProvider])],
  providers: [RefundsRepository, RefundsService],
  exports: [RefundsService],
})
export class RefundsModule {}
