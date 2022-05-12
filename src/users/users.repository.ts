import { plainToInstance } from 'class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './user.entity';
import * as bcrypt from 'bcrypt';
import { DeleteUserDTO } from './users.dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    const users = (await this.userModel.find()).map((user) => user.toObject());
    return plainToInstance(User, users);
  }

  async findOne(dto: Partial<User>): Promise<User> {
    const user = await this.userModel.findOne(dto);
    if (user) {
      return plainToInstance(User, user.toObject());
    } else {
      return undefined;
    }
  }

  async findAuthenticatedUser({
    email,
    password,
  }: DeleteUserDTO): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (!same) throw new NotFoundException('비밀번호가 일치하지 않습니다.');
      return plainToInstance(User, user.toObject());
    } else throw new NotFoundException('사용자를 찾지 못했습니다.');
  }

  async create(dto: Partial<User>): Promise<User> {
    const user = await this.userModel.create(dto);
    return plainToInstance(User, user.toObject());
  }

  async deleteOne(filter: FilterQuery<UserDocument>) {
    return this.userModel.deleteOne(filter);
  }
}
