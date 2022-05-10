import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationOptions: {
        abortEarly: true,
      },
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
        PORT: Joi.number().default(3000),

        MONGODB_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
