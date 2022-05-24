import {
  CreateOrderDTO,
  CustomerFilter,
  OrderFilter,
  OrderResponse,
} from './dtos/order.dto';
import { ProductsService } from './../products/products.service';
import { Injectable } from '@nestjs/common';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { OrdersRepository } from './orders.repository';
import { ProductSimpleEntity } from 'src/products/products.dto';
import { FilterQuery } from 'mongoose';
import { OrderDocument } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersRepository: OrdersRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  findAll(): Promise<OrderResponse[]> {
    return this.ordersRepository.findOrders({});
  }
  findUserOrders(dto: CustomerFilter): Promise<OrderResponse[]> {
    return this.ordersRepository.findOrders(dto);
  }
  async findOrder(filter: OrderFilter): Promise<OrderResponse> {
    const order = await this.ordersRepository.findOrder(filter);
    if (order) {
      return order;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }

  async count(filter?: FilterQuery<OrderDocument>): Promise<number> {
    return this.ordersRepository.countOrder({ ...filter });
  }

  async createOrder(dto: CreateOrderDTO) {
    const items = [];
    for (const item of dto.items) {
      const { uid, name, price } = await this.productsService.findOne(
        { uid: item.uid },
        ProductSimpleEntity,
      );
      items.push({
        uid,
        name,
        price,
        count: item.count,
      });
    }
    const order = await this.ordersRepository.createOrder({
      customer_id: dto.customer_id,
      items,
    });

    return order;
  }

  async deleteOrder(filter: OrderFilter) {
    const { deletedCount } = await this.ordersRepository.deleteOrder(filter);
    if (deletedCount) {
      return filter;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND,
      );
    }
  }
}
