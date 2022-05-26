import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Document, FilterQuery, Model } from 'mongoose';

export type DeleteResult = {
  acknowledged: boolean;
  deletedCount: number;
};

export type FindParameter<M, T> = {
  filter?: FilterQuery<M & Document>;
  cls: ClassConstructor<T>;
};
export type FindOneParameter<M, T> = {
  filter: FilterQuery<M & Document>;
  cls: ClassConstructor<T>;
};

export type UpdateOneParameter<M> = {
  filter: FilterQuery<M & Document>;
  data: Partial<M>;
};

export interface IRepositoryRead<M> {
  find: <T>(parameter: FindParameter<M, T>) => Promise<T[]>;
  findOne: <T>(parameter: FindOneParameter<M, T>) => Promise<T>;
  count: (filter?: FilterQuery<M & Document>) => Promise<number>;
}
export interface IRepositoryWrite<M> {
  create: (data: Partial<M>) => Promise<M>;
  updateOne: (parameter: UpdateOneParameter<M>) => Promise<M>;
  deleteOne: (filter: FilterQuery<M & Document>) => Promise<DeleteResult>;
}

export declare class IBaseRepository<M>
  implements IRepositoryWrite<M>, IRepositoryRead<M>
{
  find: <T>(parameter: FindParameter<M, T>) => Promise<T[]>;
  findOne: <T>(parameter: FindOneParameter<M, T>) => Promise<T>;
  count: (filter?: FilterQuery<M & Document>) => Promise<number>;

  create: (data: Partial<M>) => Promise<M>;
  updateOne: (parameter: UpdateOneParameter<M>) => Promise<M>;
  deleteOne: (filter: FilterQuery<M & Document>) => Promise<DeleteResult>;
}

export abstract class BaseRepository<M> implements IBaseRepository<M> {
  constructor(
    private readonly model: Model<M & Document>,
    private readonly cls: ClassConstructor<M>,
  ) {}

  async find<T>({ filter, cls }: FindParameter<M, T>): Promise<T[]> {
    const list = (await this.model.find(filter)).map((one) => one.toObject());
    return plainToInstance(cls, list, { strategy: 'excludeAll' });
  }
  async findOne<T>({ filter, cls }: FindOneParameter<M, T>): Promise<T> {
    const one = await this.model.findOne(filter);
    if (one) {
      return plainToInstance(cls, one.toObject(), { strategy: 'excludeAll' });
    } else {
      return undefined;
    }
  }
  async count(filter?: FilterQuery<M & Document>): Promise<number> {
    return this.model.count(filter);
  }
  async create(data: Partial<M>): Promise<M> {
    const one = await this.model.create(data);
    return plainToInstance(this.cls, one.toObject(), {
      strategy: 'excludeAll',
    });
  }

  async updateOne({ filter, data }: UpdateOneParameter<M>): Promise<M> {
    const one = await this.model.findOne(filter);
    if (one) {
      await this.model.updateOne(filter, data);
      return plainToInstance(
        this.cls,
        {
          ...one.toObject(),
          ...data,
        },
        { strategy: 'excludeAll' },
      );
    } else {
      return undefined;
    }
  }
  async deleteOne(filter: FilterQuery<M & Document>): Promise<DeleteResult> {
    return this.model.deleteOne(filter);
  }
}
