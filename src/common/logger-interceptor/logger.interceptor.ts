import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (!(err instanceof HttpException)) {
          console.log(
            `${err.name}${err.message ? ': ' + err.message : ''} in ${
              context.getHandler().name
            } at ${context.getClass().name}`,
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
