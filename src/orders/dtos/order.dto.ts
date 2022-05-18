import { OrderEntity } from './../entities/order.entity';
import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { UserPublic } from 'src/users/users.dto';
import { OrderItemEntity } from '../entities/order-item.entity';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export class OrderResponse extends OmitType(OrderEntity, ['_id']) {
  @Exclude()
  _id: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserPublic)
  @Expose()
  customer?: UserPublic;

  @ValidateNested({ each: true })
  @Type(() => OrderItemEntity)
  @Expose()
  items: OrderItemEntity[];
}

class CreateOrderItem {
  @IsUUID()
  uid: string;

  @IsInt()
  @Type(() => Number)
  count: number;
}

export class CreateOrderBody {
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}

export class CreateOrderDTO extends CreateOrderBody {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  customer_id: string;
}
