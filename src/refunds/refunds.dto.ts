import { PartialType, PickType } from '@nestjs/swagger';
import { RefundEntity } from './entities/refund.entity';

export class RefundFilter extends PickType(RefundEntity, ['order_id']) {}

export class UpdateRefundDTO extends PickType(PartialType(RefundEntity), [
  'reason',
  'status',
]) {}
