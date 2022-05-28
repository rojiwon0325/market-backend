import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { validate } from 'class-validator';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { JWTPayloadDTO, LoginDTO } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from 'src/users/users.dto';
import { UserDetail } from 'src/users/entities/user.detail';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpExceptionService: HttpExceptionService,
  ) {}

  async authenticate(dto: AuthDTO): Promise<UserDetail> {
    const data = plainToInstance(AuthDTO, dto);
    const errors = await validate(data);
    for (const error of errors) {
      const message = Object.entries(
        error.constraints,
      )[0][1] as ExceptionMessage;
      throw this.httpExceptionService.getBadRequestException(message);
    }
    return this.usersService.findAuthenticatedOne(data);
  }

  async signIn(user: UserDetail): Promise<LoginDTO> {
    const payload = { uid: user.uid };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
  async signInCheck(token: string) {
    const payload = this.jwtService.verify<JWTPayloadDTO>(token);
    return payload ? true : false;
  }
}
