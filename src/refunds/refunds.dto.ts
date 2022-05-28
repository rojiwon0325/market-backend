import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { RefundStatus } from './entities/refund-status';
import { RefundEntity } from './entities/refund.entity';

export class RefundFilter extends PickType(RefundEntity, [
  'order_id',
  'customer_id',
]) {}

export class AdminRefundFilter extends PickType(RefundEntity, ['order_id']) {}

export class CreateRefundBody extends PickType(RefundEntity, ['reason']) {
  @IsEnum([RefundStatus.Canceling, RefundStatus.Refunding])
  @Expose()
  status: RefundStatus;
}

export class CreateRefundDTO extends PickType(RefundEntity, [
  'order_id',
  'customer_id',
  'reason',
]) {
  @IsEnum([RefundStatus.Cancelled, RefundStatus.Refunded])
  @Expose()
  status: RefundStatus;
}

export class UpdateRefundStatus extends PickType(RefundEntity, ['status']) {}

export class UpdateRefundVisible extends PickType(RefundEntity, ['visible']) {}
