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

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly refundsService: RefundsService,
  ) {}

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
   */
  @Get('refunds')
  findRefund() {}

  @Roles(UserRole.Admin)
  @Get('refunds/all')
  findRefund_admin() {}

  @Get(':order_id')
  findOne(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
  ): Promise<Order> {
    return this.ordersService.findOne({ uid: order_id, customer_id: uid });
  }

  /**
   * 환불 취소 정보 불러오기
   */
  @Get(':order_id/refund')
  findOneRefund() {}

  @Post('create')
  create(
    @User() { uid }: UserPublic,
    @Body()
    { items }: CreateOrderBody,
  ): Promise<Order> {
    return this.ordersService.create(uid, items);
  }

  @Post(':order_id/update')
  update(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
    @Body()
    body: UpdateOrderStatus,
  ) {
    return this.ordersService.updateOne(
      { customer_id: uid, uid: order_id },
      body,
    );
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
   */
  @Post(':order_id/refund/create')
  refund() {}

  /**
   * 환불/취소 요청 처리
   */
  @Roles(UserRole.Admin)
  @Post(':order_id/refund/update')
  refund() {}
}
