import { Refund } from 'src/refunds/entities/refund';
import { plainToInstance } from 'class-transformer';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RefundsService } from 'src/refunds/refunds.service';
import { UserRole } from 'src/users/entities/user-role';
import { UserPublic } from 'src/users/entities/user.public';
import { Roles } from 'src/users/roles.decorator';
import { User } from 'src/users/user.decorator';
import { Order } from './entities/order';
import {
  CreateOrderBody,
  OrderFilter,
  OrderIdParam,
  OrdersResponse,
  UpdateOrderStatus,
} from './orders.dto';
import { OrdersService } from './orders.service';
import { CreateRefundDTO, UpdateRefundDTO } from 'src/refunds/refunds.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async find(@User() { uid }: UserPublic): Promise<OrdersResponse> {
    return {
      total: await this.ordersService.count({ customer_id: uid }),
      orders: await this.ordersService.find({ customer_id: uid }),
    };
  }

  @Roles(UserRole.Admin)
  @Get('all')
  async find_admin(): Promise<OrdersResponse> {
    return {
      total: await this.ordersService.count(),
      orders: await this.ordersService.find(),
    };
  }

  /**
   * 내 환불 취소 내역 불러오기
   
  @Get('refunds')
  async findRefund(@User() { uid }: UserPublic): Promise<Refund[]> {
    const refunds = await this.refundsService.find({ customer_id: uid });
    const result = await Promise.all(
      refunds.map(async (refund) => {
        const order = await this.ordersService.findOne({
          uid: refund.order_id,
          customer_id: uid,
        });
        return { ...refund, order };
      }),
    );
    return plainToInstance(Refund, result, { strategy: 'excludeAll' });
  }

  @Roles(UserRole.Admin)
  @Get('refunds/all')
  async findRefund_admin(): Promise<Refund[]> {
    const refunds = await this.refundsService.find();
    const result = await Promise.all(
      refunds.map(async (refund) => {
        const order = await this.ordersService.findOne({
          uid: refund.order_id,
          customer_id: refund.customer_id,
        });
        return { ...refund, order };
      }),
    );
    return plainToInstance(Refund, result, { strategy: 'excludeAll' });
  }
*/
  @Get(':order_id')
  findOne(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
  ): Promise<Order> {
    return this.ordersService.findOne({ uid: order_id, customer_id: uid });
  }

  /**
   * 환불 취소 정보 불러오기
   
  @Get(':order_id/refund')
  async findOneRefund(@Param() { order_id }: OrderIdParam) {
    const refund = await this.refundsService.findOne({ order_id });
    const order = await this.ordersService.findOne({
      uid: refund.order_id,
      customer_id: refund.customer_id,
    });
    return plainToInstance(
      Refund,
      { ...refund, order },
      { strategy: 'excludeAll' },
    );
  }*/

  @Post('create')
  create(
    @User() { uid }: UserPublic,
    @Body()
    { items }: CreateOrderBody,
  ): Promise<Order> {
    return this.ordersService.create(uid, items);
  }

  @Roles(UserRole.Admin)
  @Post(':order_id/update')
  update(
    @Param() { order_id }: OrderIdParam,
    @Body()
    body: UpdateOrderStatus,
  ) {
    return this.ordersService.updateOne({ uid: order_id }, body);
  }

  @Post(':order_id/delete')
  async delete(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
  ): Promise<OrderFilter> {
    return this.ordersService.deleteOne({ customer_id: uid, uid: order_id });
  }

  /**
   * 환불/취소 요청
   * body에 환불 or 취소 정보 담기
   
  @Post(':order_id/refund/create')
  async createRefund(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
    @Body() body: CreateRefundDTO,
  ): Promise<Refund> {
    const order = await this.ordersService.findOne({
      customer_id: uid,
      uid: order_id,
    });
    const refund = await this.refundsService.create(body);
    return plainToInstance(
      Refund,
      { ...refund, order },
      { strategy: 'excludeAll' },
    );
  }

  /**
   * 환불/취소 요청 처리
   
  @Roles(UserRole.Admin)
  @Post(':order_id/refund/update')
  async refund(
    @Param() { order_id }: OrderIdParam,
    @Body() body: UpdateRefundDTO,
  ): Promise<any> {
    const refund = await this.refundsService.updateOne({ order_id }, body);
    const order = await this.ordersService.findOne({
      uid: order_id,
      customer_id: refund.customer_id,
    });

    return plainToInstance(
      Refund,
      { ...refund, order },
      { strategy: 'excludeAll' },
    );
  }*/
}
