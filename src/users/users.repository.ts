import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserDocument, UserEntity } from './user.entity';
import {
  AuthenticateUserDTO,
  UserDetail,
  UserFilter,
  UserPublic,
} from './users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<UserPublic[]> {
    const users = (await this.userModel.find()).map((user) => user.toObject());
    return plainToInstance(UserPublic, users, { strategy: 'excludeAll' });
  }

  async findOne<T = UserEntity | UserPublic | UserDetail>(
    dto: Partial<UserEntity>,
    cls: ClassConstructor<T>,
  ): Promise<T> {
    const user = await this.userModel.findOne(dto);
    if (user) {
      return plainToInstance(cls, user.toObject(), { strategy: 'excludeAll' });
    } else {
      return undefined;
    }
  }

  async findAuthenticatedUser({
    email,
    password,
  }: AuthenticateUserDTO): Promise<UserDetail | false> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (!same) return false;
      else
        return plainToInstance(UserDetail, user.toObject(), {
          strategy: 'excludeAll',
        });
    } else {
      return undefined;
    }
  }

  async count(filter: FilterQuery<UserDocument>): Promise<number> {
    return this.userModel.count(filter);
  }

  async create(dto: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userModel.create(dto);
    return plainToInstance(UserEntity, user.toObject(), {
      strategy: 'excludeAll',
    });
  }

  async deleteOne(filter: UserFilter) {
    return this.userModel.deleteOne(filter);
  }
}
