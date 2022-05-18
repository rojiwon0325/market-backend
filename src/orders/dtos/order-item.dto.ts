import { PickType } from '@nestjs/swagger';
import { OrderItemEntity } from '../entities/order-item.entity';

export class OrderItem extends PickType(OrderItemEntity, [
  'uid',
  'product_id',
  'product_price',
  'count',
]) {}
