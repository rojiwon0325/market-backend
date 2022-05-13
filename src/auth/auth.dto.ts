import { Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { UserEntity } from 'src/users/user.entity';

export class LoginDTO {
  @IsString()
  access_token: string;

  @ValidateNested()
  @Type(() => UserEntity)
  user: UserEntity;
}

export class JWTPayloadDTO {
  @IsUUID()
  uid: string;
}
