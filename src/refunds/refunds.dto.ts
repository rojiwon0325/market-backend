import { PartialType, PickType } from '@nestjs/swagger';
import { RefundEntity } from './entities/refund.entity';

export class RefundFilter extends PickType(RefundEntity, ['order_id']) {}

export class CreateRefundDTO extends PickType(RefundEntity, [
  'order_id',
  'customer_id',
  'status',
  'reason',
]) {}

export class UpdateRefundDTO extends PickType(PartialType(RefundEntity), [
  'reason',
  'status',
]) {}
