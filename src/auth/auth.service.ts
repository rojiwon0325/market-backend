import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';
import { AuthenticateUserDTO } from 'src/users/users.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  authenticate(dto: AuthenticateUserDTO): Promise<UserEntity> {
    const data = plainToInstance(AuthenticateUserDTO, dto);
    return this.usersService.findAuthenticatedUser(data);
  }
}
