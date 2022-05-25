import { RefundsRepository } from './refunds.repository';
import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';

@Module({
  providers: [RefundsService, RefundsRepository],
})
export class RefundsModule {}
