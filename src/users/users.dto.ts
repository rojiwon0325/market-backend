import { OmitType, PickType } from '@nestjs/swagger';
import { Type, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserEntity, UserRole } from './user.entity';

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

export class UserDetail extends OmitType(UserEntity, ['_id']) {
  @Exclude()
  _id: string;
}

export class UserPublic extends OmitType(UserEntity, [
  '_id',
  'email',
  'role',
  'phone',
]) {
  @Exclude()
  _id: string;

  @Exclude()
  email: string;

  @Exclude()
  role: UserRole;

  @Exclude()
  phone?: string;
}

export type FindOneUserDTO =
  | Pick<UserEntity, 'uid'>
  | Pick<UserEntity, 'email'>;
