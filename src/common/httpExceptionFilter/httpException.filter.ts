import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = exceptionResponse['message'];
      if (typeof message === 'string') {
        response.status(status).json({
          statusCode: status,
          message: [message],
        });
      } else {
        response.status(status).json({
          statusCode: status,
          message,
        });
      }
    } else {
      response.status(status).json({
        statusCode: status,
        message: [exception.message],
      });
    }
  }
}
