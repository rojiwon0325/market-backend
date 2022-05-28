import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { Order } from './entities/order';
import { OrderStatus } from './entities/order-status';

export class OrderIdParam {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  order_id: string;
}

export class CustomerFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  customer_id: string;
}

export class AdminOrderFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
}

export class OrderFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  customer_id: string;
}

export class CreateOrderItem {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  product_id: string;

  @IsInt({ message: ExceptionMessage.VALIDATION })
  @Type(() => Number)
  count: number;
}

export class CreateOrderBody {
  @ValidateNested({ each: true, message: ExceptionMessage.VALIDATION })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}

export class UpdateOrderVisible {
  @IsBoolean({ message: ExceptionMessage.VALIDATION })
  @Type(() => Boolean)
  visible: boolean;
}

export class UpdateOrderStatus {
  @IsEnum(OrderStatus, { message: ExceptionMessage.VALIDATION })
  status: OrderStatus;
}

export class OrdersResponse {
  @IsNumber()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => Order)
  orders: Order[];
}
