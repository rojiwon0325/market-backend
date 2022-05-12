import { HttpExceptionService } from './http-exception.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [HttpExceptionService],
  exports: [HttpExceptionService],
})
export class HttpExceptionModule {}
