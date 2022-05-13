import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/user.entity';
import { JWTPayloadDTO, LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './Public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signin(
    @User() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginDTO> {
    const result = await this.authService.signin(user);
    res.cookie('access_token', result.access_token);
    return result;
  }

  @Get('sign-out')
  async signout(
    @User() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTPayloadDTO> {
    res.clearCookie('access_token');
    return { uid: user.uid };
  }
}
