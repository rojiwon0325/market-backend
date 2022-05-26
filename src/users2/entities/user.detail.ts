import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from './user.entity';

export class UserDetail extends OmitType(UserEntity, ['_id']) {
  @Exclude()
  _id: string;
}
