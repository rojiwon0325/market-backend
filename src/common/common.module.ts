import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilterModule } from 'src/common/httpExceptionFilter/httpException.filter.module';
import { LoggerModule } from 'src/common/loggerInterceptor/logger.interceptor.module';
import { ValidationPipe } from './validationPipe/validation.pipe';

@Module({
  imports: [HttpExceptionFilterModule, LoggerModule],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class CommonModule {}
