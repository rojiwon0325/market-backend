import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { HttpExceptionModule } from './httpException/http-exception.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationOptions: {
        abortEarly: true,
      },
      validationSchema: Joi.object<any, false, IEnv>({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(4000),

        JWT_DOMAIN: Joi.string().required(),
        CLIENT_DOMAIN: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRESIN: Joi.string().required(),
        MONGODB_URL: Joi.string().required(),

        AWS_CLIENT_ID: Joi.string().required(),
        AWS_SECRET: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_S3_BUCKET: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IEnv>) => ({
        uri: configService.get('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    HttpExceptionModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
