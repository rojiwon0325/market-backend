import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() => err);
        } else {
          console.log(
            `${err.name} in ${context.getHandler().name} at ${
              context.getClass().name
            }`,
          ); // 처리되지 않은 비정상 에러만 로깅하도록 한다.
          return throwError(
            () =>
              new InternalServerErrorException(
                '예기치 못한 오류가 발생했습니다.',
              ),
          );
        }
      }),
    );
  }
}
