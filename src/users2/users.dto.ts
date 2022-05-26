import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString, ValidateNested } from 'class-validator';
import { UserEntity } from './entities/user.entity';
import { UserPublic } from './entities/user.public';

export class AuthDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Type(() => String)
  password: string;
}

export class CreateUserDTO extends PickType(UserEntity, [
  'email',
  'username',
  'phone',
]) {
  @IsString()
  @Type(() => String)
  password: string;
}

export class UsersResponse {
  @IsNumber()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => UserPublic)
  users: UserPublic[];
}
