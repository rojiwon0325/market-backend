import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilterModule } from 'src/common/http-exception-filter/http-exception.filter.module';
import { LoggerModule } from 'src/common/logger-interceptor/logger.interceptor.module';
import { ValidationPipe } from './validation-pipe/validation.pipe';

@Module({
  imports: [HttpExceptionFilterModule, LoggerModule],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class CommonModule {}
