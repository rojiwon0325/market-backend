import { HttpExceptionService } from 'src/httpException/httpException.service';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDTO, DeleteUserDTO } from './users.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly exceptionService: HttpExceptionService,
  ) {}

  find(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const exist = await this.usersRepository.findOne({ email: dto.email });
    if (exist) throw this.exceptionService.getBadRequestException('USED_EMAIL');
    return this.usersRepository.create(dto);
  }

  async findByEmail({ email }: { email: string }): Promise<User> {
    const result = await this.usersRepository.findOne({ email });
    if (result) {
      return result;
    } else throw this.exceptionService.getNotFoundException('NOT_FOUND_USER');
  }

  async delete({ email, password }: DeleteUserDTO): Promise<User> {
    const user = await this.usersRepository.findAuthenticatedUser({
      email,
      password,
    });
    const { deletedCount } = await this.usersRepository.deleteOne({ email });
    if (deletedCount) {
      return user;
    } else throw this.exceptionService.getNotFoundException('NOT_DELETED');
  }
}
