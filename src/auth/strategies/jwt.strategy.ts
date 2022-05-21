import { UsersService } from './../../users/users.service';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JWTPayloadDTO } from '../auth.dto';
import { UserEntity } from 'src/users/user.entity';

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

  validate({ uid }: JWTPayloadDTO): Promise<UserEntity> {
    return this.usersService.findOne({ uid }, UserEntity);
  }
}
