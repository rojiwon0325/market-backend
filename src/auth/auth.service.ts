import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';
import { AuthenticateUserDTO } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';
import { validate } from 'class-validator';
import { HttpExceptionService } from 'src/httpException/http-exception.service';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { LoginDTO } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpExceptionService: HttpExceptionService,
  ) {}

  async authenticate(dto: AuthenticateUserDTO): Promise<UserEntity> {
    const data = plainToInstance(AuthenticateUserDTO, dto);
    const errors = await validate(data);
    for (const error of errors) {
      const message = Object.entries(
        error.constraints,
      )[0][1] as ExceptionMessage;
      throw this.httpExceptionService.getBadRequestException(message);
    }
    return this.usersService.findAuthenticatedUser(data);
  }

  async signin(user: UserEntity): Promise<LoginDTO> {
    const payload = { uid: user.uid };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
