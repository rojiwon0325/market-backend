import { OmitType } from '@nestjs/swagger';
import { UserEntity } from './user.entity';

export class UserDetail extends OmitType(UserEntity, ['_id', 'password']) {}
