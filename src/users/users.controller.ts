import { ApiInterceptor } from 'src/Interceptors/Api.interceptor';
import { UsersService } from './users.service';
import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO, DeleteUserDTO } from './users.dto';

@UseInterceptors(ApiInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async find() {
    return this.usersService.find();
  }

  @Post('create')
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  @Post('delete')
  delete(@Body() body: DeleteUserDTO) {
    return this.usersService.delete(body);
  }
}
