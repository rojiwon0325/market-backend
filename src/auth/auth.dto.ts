import { Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { UserDetail } from 'src/users/entities/user.detail';

export class LoginDTO {
  @IsString()
  access_token: string;

  @ValidateNested()
  @Type(() => UserDetail)
  user: UserDetail;
}

export class JWTPayloadDTO {
  @IsUUID()
  uid: string;
}
