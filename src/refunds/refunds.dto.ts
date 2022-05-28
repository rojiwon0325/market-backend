import { PartialType, PickType } from '@nestjs/swagger';
import { RefundEntity } from './entities/refund.entity';

export class RefundFilter extends PickType(RefundEntity, [
  'order_id',
  'customer_id',
]) {}

export class AdminRefundFilter extends PickType(RefundEntity, ['order_id']) {}

export class CreateRefundBody extends PickType(RefundEntity, [
  'order_id',
  'reason',
  'status',
]) {}

export class CreateRefundDTO extends PickType(RefundEntity, [
  'order_id',
  'customer_id',
  'status',
  'reason',
]) {}

export class UpdateRefundDTO extends PickType(PartialType(RefundEntity), [
  'status',
]) {}
