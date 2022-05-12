import { plainToInstance } from 'class-transformer';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { UserDocument, UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthenticateUserDTO } from './users.dto';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const users = (await this.userModel.find()).map((user) => user.toObject());
    return plainToInstance(UserEntity, users);
  }

  async findOne(dto: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userModel.findOne(dto);
    if (user) {
      return plainToInstance(UserEntity, user.toObject());
    } else {
      return undefined;
    }
  }

  async findAuthenticatedUser({
    email,
    password,
  }: AuthenticateUserDTO): Promise<UserEntity> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (!same)
        throw new UnauthorizedException(ExceptionMessage.INCORRECT_PASSWORD);
      return plainToInstance(UserEntity, user.toObject());
    } else throw new NotFoundException(ExceptionMessage.NOT_FOUND_USER);
  }

  async create(dto: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userModel.create(dto);
    return plainToInstance(UserEntity, user.toObject());
  }

  async deleteOne(filter: FilterQuery<UserDocument>) {
    return this.userModel.deleteOne(filter);
  }
}
