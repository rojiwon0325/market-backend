import { OmitType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserPublic extends OmitType(UserEntity, [
  '_id',
  'email',
  'phone',
]) {}
