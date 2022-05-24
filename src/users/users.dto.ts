import { OmitType, PickType } from '@nestjs/swagger';
import { Type, Exclude } from 'class-transformer';
import { IsString, IsUUID, IsNumber, ValidateNested } from 'class-validator';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { UserEntity, UserRole } from './user.entity';

export class UserIdParam {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  user_id: string;
}

export class UserFilter {
  @IsUUID(4, { message: ExceptionMessage.VALIDATION })
  uid: string;
}

export class CreateUserDTO extends PickType(UserEntity, [
  'username',
  'email',
  'phone',
] as const) {
  @IsString({ message: ExceptionMessage.VALIDATION })
  @Type(() => String)
  password: string;
}

export class AuthenticateUserDTO extends PickType(UserEntity, ['email']) {
  @IsString({ message: ExceptionMessage.VALIDATION })
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

export class UsersResponse {
  @IsNumber()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => UserPublic)
  users: UserPublic[];
}
