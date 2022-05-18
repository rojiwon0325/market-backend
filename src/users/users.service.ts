import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import {
  AuthenticateUserDTO,
  CreateUserDTO,
  FindOneUserDTO,
  UserDetail,
  UserPublic,
} from './users.dto';
import { UsersRepository } from './users.repository';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { ClassConstructor } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  find(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }

  async create(dto: CreateUserDTO): Promise<UserEntity> {
    const exist = await this.usersRepository.findOne(
      { email: dto.email },
      UserPublic,
    );
    if (exist)
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.USED_EMAIL,
      );
    return this.usersRepository.create(dto);
  }

  async findOne<T = UserEntity | UserPublic | UserDetail>(
    dto: FindOneUserDTO,
    cls: ClassConstructor<T>,
  ): Promise<T> {
    cls;
    const filter = 'uid' in dto ? { uid: dto.uid } : { email: dto.email };
    const user = await this.usersRepository.findOne(filter, cls);
    if (user) {
      return user;
    } else
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_USER,
      );
  }
  async findAuthenticatedUser(dto: AuthenticateUserDTO): Promise<UserEntity> {
    const user = await this.usersRepository.findAuthenticatedUser(dto);
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

  async delete({ email, password }: AuthenticateUserDTO): Promise<UserEntity> {
    const user = await this.findAuthenticatedUser({ email, password });
    const { deletedCount } = await this.usersRepository.deleteOne({ email });
    if (deletedCount) {
      return user;
    } else
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
  }
}
