import { UsersService } from 'src/users/users.service';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayloadDTO } from '../auth.dto';
import { UserDetail } from 'src/users/entities/user.detail';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req.cookies['access_token'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    };
    super(options);
  }

  validate({ uid }: JWTPayloadDTO): Promise<UserDetail> {
    return this.usersService.findOne({ filter: { uid }, cls: UserDetail });
  }
}
