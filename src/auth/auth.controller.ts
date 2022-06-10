import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IEnv } from 'src/interfaces/env';
import { UserDetail } from 'src/users/entities/user.detail';
import { User } from 'src/users/user.decorator';
import { JWTPayloadDTO, LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './Public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<IEnv>,
  ) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('sign-in')
  async signin(
    @User() user: UserDetail,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginDTO> {
    const result = await this.authService.signIn(user);
    res.cookie('access_token', result.access_token, {
      //domain: this.configService.get('JWT_DOMAIN'),
      //  httpOnly: true,
      //  secure: true,
    });
    return result;
  }

  @Get('sign-out')
  async signout(
    @User() user: UserDetail,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JWTPayloadDTO> {
    res.clearCookie('access_token');
    return { uid: user.uid };
  }

  @Public()
  @Get('sign-in-check')
  async isSigned(@Req() req: Request): Promise<boolean> {
    if ('access_token' in req.cookies) {
      return this.authService.signInCheck(req.cookies['access_token']);
    } else {
      return false;
    }
  }
}
