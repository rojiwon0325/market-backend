import { OrderEntity } from './../entities/order.entity';
import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UserPublic } from 'src/users/users.dto';
import { OrderItemEntity } from '../entities/order-item.entity';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export class OrderResponse extends OmitType(OrderEntity, ['_id']) {
  @Exclude()
  _id: string;

  @IsOptional()
  @ValidateNested({ message: ExceptionMessage.VALIDATION })
  @Type(() => UserPublic)
  @Expose()
  customer?: UserPublic;

  @ValidateNested({ each: true, message: ExceptionMessage.VALIDATION })
  @Type(() => OrderItemEntity)
  @Expose()
  items: OrderItemEntity[];
}

class CreateOrderItem {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;

  @IsInt({ message: ExceptionMessage.VALIDATION })
  @Type(() => Number)
  count: number;
}

export class CreateOrderBody {
  @ValidateNested({ each: true, message: ExceptionMessage.VALIDATION })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}

export class CreateOrderDTO extends CreateOrderBody {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  customer_id: string;
}

export class OrderIdParam {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  order_id: string;
}

export class CustomerFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  customer_id: string;
}

export class OrderFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  customer_id: string;
}

export class OrdersResponse {
  @IsNumber()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => OrderResponse)
  orders: OrderResponse[];
}
