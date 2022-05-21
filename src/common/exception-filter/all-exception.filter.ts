import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ExceptionMessage } from 'src/httpException/exception-message.enum';

type IResponse = {
  statusCode: number;
  message: string[];
};

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  extractExceptionMessage(exception: unknown): string[] {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const message = exceptionResponse['message'];
        if (typeof message === 'string') {
          return [message];
        } else {
          return message as string[];
        }
      } else {
        return [exception.message];
      }
    } else if (typeof exception === 'object' && 'message' in exception) {
      const message = exception['message'] as string;
      return [message];
    }
    return [ExceptionMessage.UNEXPECTED];
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody: IResponse = {
      statusCode,
      message: this.extractExceptionMessage(exception),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
