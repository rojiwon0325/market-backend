import { UserPublic } from 'src/users/entities/user.public';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user-role';
import { Roles } from 'src/users/roles.decorator';
import { User } from 'src/users/user.decorator';
import { Refund } from './entities/refund';
import { RefundsService } from './refunds.service';
import { OrderIdParam } from 'src/orders/orders.dto';
import { CreateRefundBody, UpdateRefundDTO } from './refunds.dto';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Get()
  find(@User() { uid }: UserPublic): Promise<Refund[]> {
    return this.refundsService.find({ customer_id: uid });
  }

  @Roles(UserRole.Admin)
  @Get('all')
  find_admin(): Promise<Refund[]> {
    return this.refundsService.find();
  }

  @Get(':order_id')
  findOne(
    @User() { uid }: UserPublic,
    @Param() { order_id }: OrderIdParam,
  ): Promise<Refund> {
    return this.refundsService.findOne({ order_id, customer_id: uid });
  }

  @Post('create')
  create(@User() { uid }: UserPublic, @Body() body: CreateRefundBody) {
    return this.refundsService.create({ customer_id: uid, ...body });
  }

  @Roles(UserRole.Admin)
  @Post(':order_id/update')
  async refund(
    @Param() { order_id }: OrderIdParam,
    @Body() body: UpdateRefundDTO,
  ): Promise<Refund> {
    return this.refundsService.updateOne({ order_id }, body);
  }
}
