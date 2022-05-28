import { OrdersService } from 'src/orders/orders.service';
import { RefundsRepository } from './refunds.repository';
import { Injectable } from '@nestjs/common';
import { RefundDocument, RefundEntity } from './entities/refund.entity';
import { FilterQuery } from 'mongoose';
import {
  AdminRefundFilter,
  CreateRefundDTO,
  RefundFilter,
  UpdateRefundStatus,
  UpdateRefundVisible,
} from './refunds.dto';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { Refund } from './entities/refund';
import { Serializer } from 'src/decorators/Serializer';
import { OrderStatus } from 'src/orders/entities/order-status';
import { RefundStatus } from './entities/refund-status';

@Injectable()
export class RefundsService {
  constructor(
    private readonly refundsRepository: RefundsRepository,
    private readonly ordersService: OrdersService,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  @Serializer(Refund)
  async find(filter?: FilterQuery<RefundDocument>): Promise<Refund[]> {
    const refunds = await this.refundsRepository.find({
      filter,
      cls: RefundEntity,
    });
    const result = await Promise.all(
      refunds.map(async (refund) => {
        const order = await this.ordersService.findOne({
          uid: refund.order_id,
          customer_id: refund.customer_id,
        });
        return { ...refund, order };
      }),
    );
    return result;
  }

  @Serializer(Refund)
  async findOne(filter: RefundFilter | AdminRefundFilter): Promise<Refund> {
    const refund = await this.refundsRepository.findOne({
      filter,
      cls: RefundEntity,
    });
    if (refund) {
      const order = await this.ordersService.findOne({
        uid: refund.order_id,
        customer_id: refund.customer_id,
      });
      return { ...refund, order };
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }

  count(filter?: FilterQuery<RefundDocument>): Promise<number> {
    return this.refundsRepository.count(filter);
  }

  @Serializer(Refund)
  async create(data: CreateRefundDTO): Promise<Refund> {
    const refund = await this.refundsRepository.findOne({
      filter: { order_id: data.order_id },
      cls: RefundEntity,
    });
    if (refund) {
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.USED_REFUND,
      );
    } else {
      const order = await this.ordersService.findOne({
        uid: data.order_id,
        customer_id: data.customer_id,
      });
      if (
        order.status !== OrderStatus.Pending &&
        data.status === RefundStatus.Canceling
      ) {
        throw this.exceptionService.getBadRequestException(
          ExceptionMessage.CANT_CANCELING,
        );
      } else if (
        order.status === OrderStatus.Pending &&
        data.status === RefundStatus.Refunding
      ) {
        data.status = RefundStatus.Canceling;
      }
      const result = await this.refundsRepository.create(data);
      await this.ordersService.updateOne(
        { uid: order.uid },
        { status: result.status },
      );
      order.status = result.status;
      return { ...result, order };
    }
  }

  @Serializer(Refund)
  async updateOne(
    filter: RefundFilter | AdminRefundFilter,
    data: UpdateRefundStatus | UpdateRefundVisible,
  ): Promise<Refund> {
    const refund = await this.refundsRepository.updateOne({ filter, data });
    if (refund) {
      const order = await this.ordersService.findOne({
        customer_id: refund.customer_id,
        uid: refund.order_id,
      });
      if ('status' in data) {
        await this.ordersService.updateOne(
          { uid: order.uid },
          { status: refund.status },
        );
        order.status = refund.status;
      }
      return { ...refund, order };
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }
  async deleteOne(
    filter: RefundFilter | AdminRefundFilter,
  ): Promise<RefundFilter | AdminRefundFilter> {
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
