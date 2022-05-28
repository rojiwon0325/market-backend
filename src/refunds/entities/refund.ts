import { ValidateNested } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { RefundEntity } from './refund.entity';
import { Expose, Type } from 'class-transformer';
import { Order } from 'src/orders/entities/order';

export class Refund extends OmitType(RefundEntity, [
  '_id',
  'order_id',
  'visible',
]) {
  @ValidateNested()
  @Type(() => Order)
  @Expose()
  order: Order;
}
