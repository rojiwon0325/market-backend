import { plainToInstance } from 'class-transformer';
import {
  BaseRepository,
  DeleteResult,
  FindOneParameter,
  FindParameter,
} from 'src/interfaces/repository';
import { OrderItemDocument } from './entities/order-item.entity';
import { OrderDocument } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderEntity } from './entities/order.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Order } from './entities/order';
import { OrderItem } from './entities/order-item';
import { OrderIdParam } from './order.dto';

@Injectable()
export class OrdersRepository extends BaseRepository<OrderEntity> {
  constructor(
    @InjectModel(OrderEntity.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItemEntity.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
  ) {
    super(orderModel, OrderEntity);
  }

  async find<T = Order>({
    filter,
    cls,
  }: FindParameter<OrderEntity, T>): Promise<T[]> {
    const orders = await this.orderModel.find(filter);
    const result = await Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemModel.find({ order_id: order.uid });
        return {
          ...order.toObject(),
          items: items.map((item) => item.toObject()),
        };
      }),
    );
    return plainToInstance(cls, result, { strategy: 'excludeAll' });
  }

  async findOrderItems({ order_id }: OrderIdParam): Promise<OrderItem[]> {
    const items = (await this.orderItemModel.find({ order_id })).map((item) =>
      item.toObject(),
    );
    return plainToInstance(OrderItem, items, { strategy: 'excludeAll' });
  }

  async findOne<T = Order>({
    filter,
    cls,
  }: FindOneParameter<OrderEntity, T>): Promise<T> {
    const order = await this.orderModel.findOne(filter);
    if (order) {
      const items = await this.orderItemModel.find({ order_id: order.uid });
      const result = {
        ...order.toObject(),
        items: items.map((item) => item.toObject()),
      };
      return plainToInstance(cls, result, { strategy: 'excludeAll' });
    } else {
      return undefined;
    }
  }
  async createOrder(data: Partial<OrderEntity>): Promise<Order> {
    const order = await this.orderModel.create(data);
    return plainToInstance(
      Order,
      { ...order.toObject(), items: [] },
      {
        strategy: 'excludeAll',
      },
    );
  }
  async createItem(data: Partial<OrderItemEntity>): Promise<OrderItem> {
    const orderItem = await this.orderItemModel.create(data);
    return plainToInstance(OrderItem, orderItem, { strategy: 'excludeAll' });
  }

  async deleteOne(filter: FilterQuery<OrderDocument>): Promise<DeleteResult> {
    const order = await this.orderModel.findOne(filter);
    if (order) {
      await this.orderItemModel.deleteMany({ order_id: order.uid });
      return this.orderModel.deleteOne(filter);
    } else {
      return { acknowledged: false, deletedCount: 0 };
    }
  }
}
