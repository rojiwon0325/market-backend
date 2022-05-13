import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { AuthenticateUserDTO, CreateUserDTO } from './users.dto';
import { UsersRepository } from './users.repository';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

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
    const exist = await this.usersRepository.findOne({ email: dto.email });
    if (exist)
      throw this.exceptionService.getBadRequestException(
        ExceptionMessage.USED_EMAIL,
      );
    return this.usersRepository.create(dto);
  }

  async findByUid({ uid }: { uid: string }): Promise<UserEntity> {
    const result = await this.usersRepository.findOne({ uid });
    if (result) {
      return result;
    } else
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_USER,
      );
  }

  async findByEmail({ email }: { email: string }): Promise<UserEntity> {
    const result = await this.usersRepository.findOne({ email });
    if (result) {
      return result;
    } else
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_FOUND_USER,
      );
  }

  findAuthenticatedUser(dto: AuthenticateUserDTO): Promise<UserEntity> {
    return this.usersRepository.findAuthenticatedUser(dto);
  }

  async delete({ email, password }: AuthenticateUserDTO): Promise<UserEntity> {
    const user = await this.usersRepository.findAuthenticatedUser({
      email,
      password,
    });
    const { deletedCount } = await this.usersRepository.deleteOne({ email });
    if (deletedCount) {
      return user;
    } else
      throw this.exceptionService.getNotFoundException(
        ExceptionMessage.NOT_DELETED,
      );
  }
}
