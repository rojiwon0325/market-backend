import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable, map, catchError, throwError } from 'rxjs';
import CustomError from 'src/common/CustomError';

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => instanceToPlain(data)),
      catchError((err) => {
        if (err.name === CustomError.CustomErrorName) {
          return throwError(
            () => new HttpException(err.message, err.statusCode),
          );
        } else {
          console.log(err);
          return throwError(
            () =>
              new HttpException(
                CustomError.UnExpectedErrorMessage,
                CustomError.HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }
      }),
    );
  }
}
