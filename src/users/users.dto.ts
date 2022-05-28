import { ExceptionMessage } from 'src/httpException/exception-message.enum';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString, ValidateNested } from 'class-validator';
import { UserEntity } from './entities/user.entity';
import { UserPublic } from './entities/user.public';

export class AuthDTO {
  @IsEmail({ message: ExceptionMessage.VALIDATION_EMAIL })
  email: string;

  @IsString({ message: ExceptionMessage.VALIDATION })
  @Type(() => String)
  password: string;
}

export class CreateUserDTO extends PickType(UserEntity, [
  'email',
  'username',
  'phone',
]) {
  @IsString({ message: ExceptionMessage.VALIDATION })
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
