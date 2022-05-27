import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
} from './order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.Admin)
  @Get('all')
  async find_admin(): Promise<OrdersResponse> {
    return {
      total: await this.ordersService.count(),
      orders: await this.ordersService.find(),
    };
  }

  @Get()
  async find(@User() { uid }: UserPublic): Promise<OrdersResponse> {
    return {
      total: await this.ordersService.count({ customer_id: uid }),
      orders: await this.ordersService.find({ customer_id: uid }),
    };
  }

  @Get(':order_id')
  findOne(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
  ): Promise<Order> {
    return this.ordersService.findOne({ uid: order_id, customer_id: uid });
  }

  @Post('create')
  create(
    @User() { uid }: UserPublic,
    @Body()
    { items }: CreateOrderBody,
  ): Promise<Order> {
    return this.ordersService.create(uid, items);
  }

  @Post('order_id/update')
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
}
