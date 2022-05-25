import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { FilterQuery, Model } from 'mongoose';
import { RefundDocument, RefundEntity } from './refund.entity';
import { CreateRefundDTO, UpdateRefundDTO } from './refunds.dto';

@Injectable()
export class RefundsRepository {
  constructor(
    @InjectModel(RefundEntity.name)
    private refundModel: Model<RefundDocument>,
  ) {}

  async findOne<T = RefundEntity>({
    filter,
    cls,
  }: {
    filter?: FilterQuery<RefundDocument>;
    cls: ClassConstructor<T>;
  }): Promise<T> {
    const refund = await this.refundModel.findOne({ ...filter });
    if (refund) {
      return plainToInstance(cls, refund.toObject(), {
        strategy: 'excludeAll',
      });
    } else {
      return undefined;
    }
  }
  async find<T = RefundEntity>({
    filter,
    cls,
  }: {
    filter?: FilterQuery<RefundDocument>;
    cls: ClassConstructor<T>;
  }): Promise<T[]> {
    const refunds = (await this.refundModel.find({ ...filter })).map((refund) =>
      refund.toObject(),
    );
    return plainToInstance(cls, refunds, { strategy: 'excludeAll' });
  }

  async create(dto: CreateRefundDTO): Promise<RefundEntity> {
    const refund = await this.refundModel.create(dto);
    return plainToInstance(RefundEntity, refund.toObject(), {
      strategy: 'excludeAll',
    });
  }

  async updateOne({ filter, data }: UpdateRefundDTO): Promise<RefundEntity> {
    const refund = await this.refundModel.findOne(filter);
    if (refund) {
      await this.refundModel.updateOne(filter, data);
      return plainToInstance(
        RefundEntity,
        {
          ...refund.toObject(),
          ...data,
        },
        { strategy: 'excludeAll' },
      );
    } else {
      return undefined;
    }
  }

  async deleteOne(filter: FilterQuery<RefundDocument>) {
    return this.refundModel.deleteOne(filter);
  }
}
