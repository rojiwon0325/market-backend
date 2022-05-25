import { RefundDocument, RefundEntity } from './refund.entity';
import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { FilterQuery } from 'mongoose';

export class CreateRefundDTO extends OmitType(RefundEntity, ['_id']) {
  @Exclude()
  _id: string;
}

export class UpdateRefundBody {}

export type UpdateRefundDTO = {
  filter: FilterQuery<RefundDocument>;
  data: UpdateRefundBody;
};
