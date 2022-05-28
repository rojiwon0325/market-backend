import { FilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { UserDetail } from './entities/user.detail';
import { UserDocument, UserEntity } from './entities/user.entity';
import { UserPublic } from './entities/user.public';
import { AuthDTO, CreateUserDTO } from './users.dto';
import { UsersRepository } from './users.repository';
import { FindOneParameter, FindParameter } from 'src/interfaces/repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  find<T = UserEntity | UserPublic | UserDetail>(
    parameter: FindParameter<UserEntity, T>,
  ): Promise<T[]> {
    return this.usersRepository.find(parameter);
  }
  async findOne<T = UserEntity | UserPublic | UserDetail>(
    parameter: FindOneParameter<UserEntity, T>,
  ): Promise<T> {
    const user = await this.usersRepository.findOne(parameter);
    if (user) {
      return user;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_USER,
      );
    }
  }
  async findAuthenticatedOne(dto: AuthDTO): Promise<UserDetail> {
    const user = await this.usersRepository.findAuthenticatedOne(dto);
    if (user === false) {
      throw this.exceptionService.getUnauthorizedException(
        ExceptionMessage.INCORRECT_PASSWORD,
      );
    } else if (user) {
      return user;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_USER,
      );
    }
  }
  async count(filter?: FilterQuery<UserDocument>): Promise<number> {
    return this.usersRepository.count(filter);
  }

  async create(dto: CreateUserDTO): Promise<UserEntity> {
    const exist = await this.usersRepository.findOne({
      filter: { email: dto.email },
      cls: UserPublic,
    });
    if (exist)
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.USED_EMAIL,
      );
    return this.usersRepository.create(dto);
  }
  async deleteOne({ email, password }: AuthDTO): Promise<UserDetail> {
    const user = await this.findAuthenticatedOne({ email, password });
    const { deletedCount } = await this.usersRepository.deleteOne({
      uid: user.uid,
    });
    if (deletedCount) {
      return user;
    } else {
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
    }
  }
}
