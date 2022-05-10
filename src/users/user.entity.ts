import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as MUUID from 'uuid-mongodb';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Exclude()
  _id: string;

  @IsUUID()
  @Prop({ required: true, default: () => MUUID.v4() })
  uid: string;

  @IsString()
  @Prop({ required: true })
  username: string;

  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @IsString()
  @IsOptional()
  @Prop()
  phone?: string;
}

export const UserSchemaProvider = {
  name: User.name,
  useFactory: () => {
    const schema = SchemaFactory.createForClass(User);
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
