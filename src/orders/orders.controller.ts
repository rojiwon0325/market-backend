import { CreateOrderBody, OrderIdParam } from './dtos/order.dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';
import { User } from 'src/users/user.decorator';
import { OrdersService } from './orders.service';
import { UserDetail } from 'src/users/users.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * 나중에 지워야 하는 테스트용 api
   */
  @Public()
  @Get('all')
  find() {
    return this.ordersService.findAll();
  }

  @Get()
  findUserOrders(@User() user: UserDetail) {
    return this.ordersService.findUserOrders({ customer_id: user.uid });
  }

  @Get(':order_id')
  findOne(@User() user: UserDetail, @Param() { order_id }: OrderIdParam) {
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
  ) {
    const order = await this.ordersService.createOrder({
      customer_id: user.uid,
      items,
    });
    order.customer = user;
    return order;
  }
}
