import {
  CreateOrderBody,
  OrderFilter,
  OrderIdParam,
  OrderResponse,
  OrdersResponse,
} from './dtos/order.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/users/user.decorator';
import { OrdersService } from './orders.service';
import { UserDetail } from 'src/users/users.dto';
import { Roles } from 'src/users/roles.decorator';
import { UserRole } from 'src/users/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.Admin)
  @Get('all')
  find(): Promise<OrderResponse[]> {
    return this.ordersService.findAll();
  }

  @Get()
  async findUserOrders(@User() user: UserDetail): Promise<OrdersResponse> {
    return {
      total: await this.ordersService.count({ customer_id: user.uid }),
      orders: await this.ordersService.findUserOrders({
        customer_id: user.uid,
      }),
    };
  }

  @Get(':order_id')
  findOne(
    @User() user: UserDetail,
    @Param() { order_id }: OrderIdParam,
  ): Promise<OrderResponse> {
    return this.ordersService.findOrder({
      uid: order_id,
      customer_id: user.uid,
    });
  }

  /**
   * 주문 접수 api
   */
  @Post('create')
  async create(
    @User() user: UserDetail,
    @Body()
    { items }: CreateOrderBody,
  ): Promise<OrderResponse> {
    const order = await this.ordersService.createOrder({
      customer_id: user.uid,
      items,
    });
    order.customer = user;
    return order;
  }

  @Post(':order_id/delete')
  async delete(
    @User() { uid }: UserDetail,
    @Param() { order_id }: OrderIdParam,
  ): Promise<OrderFilter> {
    return this.ordersService.deleteOrder({ customer_id: uid, uid: order_id });
  }
}
