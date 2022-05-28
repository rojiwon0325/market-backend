import { OmitType } from '@nestjs/swagger';
import { OrderItemEntity } from './order-item.entity';

export class OrderItem extends OmitType(OrderItemEntity, ['_id']) {}
