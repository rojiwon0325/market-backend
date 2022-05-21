import { UsersService } from './users.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthenticateUserDTO, CreateUserDTO, UserDetail } from './users.dto';
import { User } from './user.decorator';
import { UserRole } from './user.entity';
import { Roles } from './roles.decorator';
import { Public } from 'src/auth/Public.decorator';

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

  @Public()
  @Post('create')
  create(@Body() body: CreateUserDTO) {
    return this.usersService.create(body);
  }

  /**
   * 자기 자신만 바꿀 수 있다. 로그인 한 정보가 아닌 body정보로 '나'를 인증
   */
  @Post('delete')
  delete(@Body() body: AuthenticateUserDTO) {
    return this.usersService.delete(body);
  }
}
