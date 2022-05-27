import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BaseRepository,
  FindOneParameter,
  FindParameter,
} from 'src/interfaces/repository';
import { RefundDocument, RefundEntity } from './entities/refund.entity';

@Injectable()
export class RefundsRepository extends BaseRepository<RefundEntity> {
  constructor(
    @InjectModel(RefundEntity.name)
    private refundModel: Model<RefundDocument>,
  ) {
    super(refundModel, RefundEntity);
  }
  find<T = RefundEntity>(
    parameter: FindParameter<RefundEntity, T>,
  ): Promise<T[]> {
    return super.find(parameter);
  }
  findOne<T = RefundEntity>(
    parameter: FindOneParameter<RefundEntity, T>,
  ): Promise<T> {
    return super.findOne(parameter);
  }
}
