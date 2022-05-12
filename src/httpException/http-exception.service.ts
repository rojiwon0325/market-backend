import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionMessage } from './exception-message.enum';

@Injectable()
export class HttpExceptionService {
  getHttpException(
    message: ExceptionMessage,
    status: HttpStatus,
  ): HttpException {
    return new HttpException(message, status);
  }

  getBadRequestException(message: ExceptionMessage): BadRequestException {
    return new BadRequestException(message);
  }

  getNotFoundException(message: ExceptionMessage): NotFoundException {
    return new NotFoundException(message);
  }

  getForbiddenException(message: ExceptionMessage): ForbiddenException {
    return new ForbiddenException(message);
  }

  getUnauthorizedException(message: ExceptionMessage): UnauthorizedException {
    return new UnauthorizedException(message);
  }

  getInternalSErverError(
    message: ExceptionMessage,
  ): InternalServerErrorException {
    return new InternalServerErrorException(message);
  }
}
