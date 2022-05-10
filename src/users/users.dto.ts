import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { User } from './user.entity';

export class CreateUserDTO extends PickType(User, [
  'username',
  'email',
  'phone',
] as const) {
  @IsString()
  @Type(() => String)
  password: string;
}

export class DeleteUserDTO extends PickType(User, ['email']) {
  @IsString()
  @Type(() => String)
  password: string;
}
