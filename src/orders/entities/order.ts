import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { OrderItem } from './order-item';
import { OrderEntity } from './order.entity';

export class Order extends OmitType(OrderEntity, ['_id', 'visible']) {
  @ValidateNested({ each: true, message: ExceptionMessage.VALIDATION })
  @Type(() => OrderItem)
  @Expose()
  items: OrderItem[];
}
