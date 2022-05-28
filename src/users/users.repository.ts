import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BaseRepository,
  FindOneParameter,
  FindParameter,
} from 'src/interfaces/repository';
import { UserDetail } from './entities/user.detail';
import { UserDocument, UserEntity } from './entities/user.entity';
import { UserPublic } from './entities/user.public';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { AuthDTO } from './users.dto';

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel, UserEntity);
  }
  find<T = UserEntity | UserPublic | UserDetail>(
    parameter: FindParameter<UserEntity, T>,
  ): Promise<T[]> {
    return super.find(parameter);
  }

  findOne<T = UserEntity | UserPublic | UserDetail>(
    parameter: FindOneParameter<UserEntity, T>,
  ): Promise<T> {
    return super.findOne(parameter);
  }

  async findAuthenticatedOne({ email, password }: AuthDTO) {
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
}
