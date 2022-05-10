import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { CreateUserDTO, DeleteUserDTO } from './users.dto';
import * as bcrypt from 'bcrypt';
import CustomError from 'src/common/CustomError';

@Injectable()
export class UsersService {
  private readonly NotFoundUserMessage = '사용자를 찾지 못했습니다.';
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async find(): Promise<User[]> {
    const result = (await this.userModel.find()).map((user) => user.toObject());
    return plainToInstance(User, result);
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const exist = await this.userModel.findOne({ email: dto.email });
    if (exist) {
      throw new CustomError(
        '이미 사용중인 이메일입니다.',
        CustomError.HttpStatus.BAD_REQUEST,
      );
    }
    const result = (await this.userModel.create(dto)).toObject();
    return plainToInstance(User, result);
  }

  async findByEmail({ email }: { email: string }): Promise<User> {
    const result = await this.userModel.findOne({ email });
    if (result) {
      return plainToInstance(User, result.toObject());
    } else {
      throw new CustomError(
        this.NotFoundUserMessage,
        CustomError.HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete({ email, password }: DeleteUserDTO): Promise<User> {
    const user = await this.authenticatedUser({ email, password });
    const { deletedCount } = await this.userModel.deleteOne({ email });
    console.log(deletedCount);
    if (deletedCount) {
      return user;
    } else {
      throw new CustomError('삭제된 데이터가 없습니다.');
    }
  }

  async authenticatedUser({ email, password }: DeleteUserDTO): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      await this.checkPassword(password, user.password);
      return plainToInstance(User, user.toObject());
    } else {
      throw new CustomError(
        this.NotFoundUserMessage,
        CustomError.HttpStatus.NOT_FOUND,
      );
    }
  }

  async checkPassword(data: string, encrypted: string): Promise<void> {
    const same = await bcrypt.compare(data, encrypted);
    if (!same)
      throw new CustomError(
        '비밀번호가 일치하지 않습니다.',
        CustomError.HttpStatus.FORBIDDEN,
      );
  }
}
