import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/Public.decorator';
import { UserRole } from './entities/user-role';
import { UserDetail } from './entities/user.detail';
import { UserEntity } from './entities/user.entity';
import { UserPublic } from './entities/user.public';
import { Roles } from './roles.decorator';
import { User } from './user.decorator';
import { AuthDTO, CreateUserDTO, UsersResponse } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.Admin)
  @Get()
  async find(): Promise<UsersResponse> {
    return {
      total: await this.usersService.count(),
      users: await this.usersService.find({ cls: UserPublic }),
    };
  }
  @Get('profile')
  async profile(@User() user: UserDetail): Promise<UserDetail> {
    return user;
  }

  @Public()
  @Post('create')
  create(@Body() body: CreateUserDTO): Promise<UserEntity> {
    return this.usersService.create(body);
  }

  @Post('delete')
  delete(@Body() body: AuthDTO): Promise<UserDetail> {
    return this.usersService.deleteOne(body);
  }
}
