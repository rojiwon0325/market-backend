import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { FilterQuery, Model } from 'mongoose';
import { OrderFilter, OrderResponse } from './dtos/order.dto';
import {
  OrderItemDocument,
  OrderItemEntity,
} from './entities/order-item.entity';
import { OrderDocument, OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(OrderEntity.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItemEntity.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
  ) {}

  /**
   * 전체 조회, 사용자별 조회
   */
  async findOrders(dto: { customer_id?: string }): Promise<OrderResponse[]> {
    const orders = await this.orderModel.find(dto);
    const result = [];
    for (const order of orders) {
      const items = await this.orderItemModel.find({ order_id: order.uid });
      result.push({
        ...order.toObject(),
        items: items.map((item) => item.toObject()),
      });
    }
    return plainToInstance(OrderResponse, result, { strategy: 'excludeAll' });
  }

  async findOrder(filter: OrderFilter): Promise<OrderResponse> {
    const order = await this.orderModel.findOne(filter);
    if (order) {
      const items = await this.orderItemModel.find({ order_id: order.uid });
      const result = {
        ...order.toObject(),
        items: items.map((item) => item.toObject()),
      };
      return plainToInstance(OrderResponse, result, { strategy: 'excludeAll' });
    } else {
      return undefined;
    }
  }

  async countOrder(filter: FilterQuery<OrderDocument>): Promise<number> {
    return this.orderModel.count(filter);
  }

  async createOrder({
    customer_id,
    items,
  }: {
    customer_id: string;
    items: {
      uid: string;
      name: string;
      price: number;
      count: number;
    }[];
  }): Promise<OrderResponse> {
    const order = await this.orderModel.create({ customer_id });
    const orderItems = [];
    let total_price = 0;
    for (const item of items) {
      const orderItem = await this.orderItemModel.create({
        order_id: order.uid,
        product_id: item.uid,
        product_name: item.name,
        product_price: item.price,
        count: item.count,
      });
      total_price += item.price * item.count;
      orderItems.push(orderItem.toObject());
    }
    await this.orderModel.updateOne({ uid: order.uid }, { total_price });
    const result = { ...order.toObject(), total_price, items: orderItems };
    return plainToInstance(OrderResponse, result, { strategy: 'excludeAll' });
  }

  async deleteOrder(filter: OrderFilter) {
    const result = await this.orderItemModel.deleteOne(filter);
    if (result.deletedCount) {
      await this.orderItemModel.deleteMany({ order_id: filter.uid });
      return result;
    } else {
      return result;
    }
  }
}
