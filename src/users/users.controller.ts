import { UsersService } from './users.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthenticateUserDTO, CreateUserDTO, UserDetail } from './users.dto';
import { User } from './user.decorator';
import { UserRole } from './user.entity';
import { Roles } from './roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.Admin)
  @Get()
  find() {
    return this.usersService.find();
  }

  @Get('profile')
  profile(@User() user: UserDetail) {
    return user;
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
