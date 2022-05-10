import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaProvider } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [MongooseModule.forFeatureAsync([UserSchemaProvider])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
