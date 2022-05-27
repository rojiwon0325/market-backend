import { RefundsRepository } from './refunds.repository';
import { Injectable } from '@nestjs/common';
import { RefundDocument, RefundEntity } from './entities/refund.entity';
import { FilterQuery } from 'mongoose';
import { RefundFilter, UpdateRefundDTO } from './refunds.dto';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

@Injectable()
export class RefundsService {
  constructor(
    private readonly refundsRepository: RefundsRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  async find(filter?: FilterQuery<RefundDocument>): Promise<RefundEntity[]> {
    return this.refundsRepository.find({
      filter,
      cls: RefundEntity,
    });
  }
  async findOne(filter: RefundFilter): Promise<RefundEntity> {
    const refund = await this.refundsRepository.findOne({
      filter,
      cls: RefundEntity,
    });
    if (refund) {
      return refund;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }

  count(filter?: FilterQuery<RefundDocument>): Promise<number> {
    return this.refundsRepository.count(filter);
  }
  async updateOne(
    filter: RefundFilter,
    data: UpdateRefundDTO,
  ): Promise<RefundEntity> {
    const refund = await this.refundsRepository.updateOne({ filter, data });
    if (refund) {
      return refund;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }
  async deleteOne(filter: RefundFilter) {
    const { deletedCount } = await this.refundsRepository.deleteOne(filter);
    if (deletedCount) {
      return filter;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
    }
  }
}
