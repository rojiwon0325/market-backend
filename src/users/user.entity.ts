import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as MUUID from 'uuid-mongodb';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

export type UserDocument = UserEntity & Document;

@Schema()
export class UserEntity {
  @Exclude()
  _id: string;

  @IsUUID()
  @Prop({ required: true, default: () => MUUID.v4() })
  uid: string;

  @IsString({ message: ExceptionMessage.VALIDATION })
  @Prop({ required: true })
  username: string;

  @IsEmail({}, { message: ExceptionMessage.VALIDATION_EMAIL })
  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  // 010-0000-0000 형식을 지키도록 IsMatch와 정규표현식을 사용하는 것이 좋을 것 같음
  @IsString({ message: ExceptionMessage.VALIDATION })
  @IsOptional()
  @Prop()
  phone?: string;
}

export const UserSchemaProvider = {
  name: UserEntity.name,
  useFactory: () => {
    const schema = SchemaFactory.createForClass(UserEntity);
    schema.pre('save', function (next) {
      const user = this as UserDocument;
      bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          user.password = hash;
          next();
        });
      });
    });
    return schema;
  },
};
