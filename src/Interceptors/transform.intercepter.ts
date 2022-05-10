import {
  ExecutionContext,
  Injectable,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
  constructor(private readonly cls: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        console.log(data);
        return plainToInstance(this.cls, data);
      }),
    );
  }
}
