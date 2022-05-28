import { UserPublic } from 'src/users/entities/user.public';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user-role';
import { Roles } from 'src/users/roles.decorator';
import { User } from 'src/users/user.decorator';
import { Refund, RefundsResponse } from './entities/refund';
import { RefundsService } from './refunds.service';
import { OrderIdParam } from 'src/orders/orders.dto';
import { CreateRefundBody, UpdateRefundStatus } from './refunds.dto';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Get()
  async find(@User() { uid }: UserPublic): Promise<RefundsResponse> {
    return {
      total: await this.refundsService.count({
        customer_id: uid,
        visible: true,
      }),
      refunds: await this.refundsService.find({
        customer_id: uid,
        visible: true,
      }),
    };
  }

  @Roles(UserRole.Admin)
  @Get('all')
  async find_admin(): Promise<RefundsResponse> {
    return {
      total: await this.refundsService.count(),
      refunds: await this.refundsService.find(),
    };
  }

  @Get(':order_id')
  findOne(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
  ): Promise<Refund> {
    return this.refundsService.findOne({ order_id, customer_id: uid });
  }

  @Post(':order_id/create')
  create(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
    @Body() body: CreateRefundBody,
  ): Promise<Refund> {
    return this.refundsService.create({ customer_id: uid, order_id, ...body });
  }

  @Roles(UserRole.Admin)
  @Post(':order_id/update')
  update_admin(
    @Param() { order_id }: OrderIdParam,
    @Body() body: UpdateRefundStatus,
  ): Promise<Refund> {
    return this.refundsService.updateOne({ order_id }, body);
  }

  @Post(':order_id/delete')
  delete(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
  ): Promise<Refund> {
    return this.refundsService.updateOne(
      { order_id, customer_id: uid },
      { visible: false },
    );
  }
}
