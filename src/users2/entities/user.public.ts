import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from './user.entity';

export class UserPublic extends OmitType(UserEntity, [
  '_id',
  'email',
  'phone',
]) {
  @Exclude()
  _id: string;

  @Exclude()
  email: string;

  @Exclude()
  phone?: string;
}
