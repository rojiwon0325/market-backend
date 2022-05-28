import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ProductSimple } from 'src/products/entities/product.simple';
import { ProductsService } from 'src/products/products.service';
import { Order } from './entities/order';
import { OrderDocument } from './entities/order.entity';
import {
  AdminOrderFilter,
  CreateOrderItem,
  OrderFilter,
  UpdateOrderStatus,
} from './orders.dto';
import { OrdersRepository } from './orders.repository';
import { Serializer } from 'src/decorators/Serializer';

@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersRepository: OrdersRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  find(filter?: FilterQuery<OrderDocument>): Promise<Order[]> {
    return this.ordersRepository.find({ filter, cls: Order });
  }

  async findOne(filter: OrderFilter): Promise<Order> {
    const order = await this.ordersRepository.findOne({ filter, cls: Order });
    if (order) {
      return order;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }

  count(filter?: FilterQuery<OrderDocument>): Promise<number> {
    return this.ordersRepository.count(filter);
  }

  async create(customer_id: string, items: CreateOrderItem[]): Promise<Order> {
    const order = await this.ordersRepository.createOrder({ customer_id });
    order.items = await Promise.all(
      items.map(async ({ product_id, count }) => {
        const { uid, name, price } = await this.productsService.findOne({
          filter: { uid: product_id },
          cls: ProductSimple,
        });
        return this.ordersRepository.createItem({
          order_id: order.uid,
          product_id: uid,
          product_name: name,
          product_price: price,
          count,
        });
      }),
    );
    return order;
  }

  @Serializer(Order)
  async updateOne(
    filter: OrderFilter | AdminOrderFilter,
    data: UpdateOrderStatus,
  ): Promise<Order> {
    const order = await this.ordersRepository.updateOne({ filter, data });
    if (order) {
      const items = await this.ordersRepository.findOrderItems({
        order_id: order.uid,
      });
      return { ...order, items };
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }

  async deleteOne(filter: OrderFilter): Promise<OrderFilter> {
    const { deletedCount } = await this.ordersRepository.deleteOne(filter);
    if (deletedCount) {
      return filter;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }
}
