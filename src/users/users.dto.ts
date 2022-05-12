import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserEntity } from './user.entity';

export class CreateUserDTO extends PickType(UserEntity, [
  'username',
  'email',
  'phone',
] as const) {
  @IsString()
  @Type(() => String)
  password: string;
}

export class AuthenticateUserDTO extends PickType(UserEntity, ['email']) {
  @IsString()
  @Type(() => String)
  password: string;
}
