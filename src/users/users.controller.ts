import { UsersService } from './users.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthenticateUserDTO, CreateUserDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  find() {
    return this.usersService.find();
  }

  @Post('create')
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  @Post('delete')
  delete(@Body() body: AuthenticateUserDTO) {
    return this.usersService.delete(body);
  }
}
