import { Module } from '@nestjs/common';
import { RefundsService } from './refunds.service';

@Module({
  providers: [RefundsService]
})
export class RefundsModule {}
