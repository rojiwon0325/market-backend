import { plainToInstance } from 'class-transformer';
import { UserPublic, UserDetail } from './../users/users.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { UserDocument, UserEntity } from 'src/users/user.entity';
import {
  BaseRepository,
  DeleteResult,
  FindOneParameter,
  FindParameter,
} from './repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
  ) {
    super(userModel, UserEntity);
  }
  async find<T = UserEntity | UserPublic | UserDetail>(
    parameter: FindParameter<UserEntity, T>,
  ): Promise<T[]> {
    return super.find(parameter);
  }

  async findOne<T = UserEntity | UserPublic | UserDetail>(
    parameter: FindOneParameter<UserEntity, T>,
  ): Promise<T> {
    return super.findOne(parameter);
  }

  async findAuthenticatedOne({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (!same) return false;
      else {
        return plainToInstance(UserDetail, user.toObject(), {
          strategy: 'excludeAll',
        });
      }
    } else {
      return undefined;
    }
  }

  async count(filter?: FilterQuery<UserDocument>): Promise<number> {
    return super.count(filter);
  }
  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    return super.create(data);
  }

  async deleteOne(filter: FilterQuery<UserDocument>): Promise<DeleteResult> {
    return super.deleteOne(filter);
  }
}
