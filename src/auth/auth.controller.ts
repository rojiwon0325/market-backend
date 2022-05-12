import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/user.entity';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async login(@User() user: UserEntity) {
    return { access_token: 'secretKey', user };
  }
}
