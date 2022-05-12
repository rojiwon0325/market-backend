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

type IExceptionMessage = {
  NOT_FOUND: string;
  NOT_FOUND_USER: string;
  USED_EMAIL: string;
  NOT_DELETED: string;
  INCORRECT_PASSWORD: string;
  UNEXPECTED: string;
};

@Injectable()
export class HttpExceptionService {
  private readonly ExceptionMessage: IExceptionMessage = {
    NOT_FOUND: '결과를 찾지 못했습니다.',
    NOT_FOUND_USER: '사용자를 찾을 수 없습니다.',
    USED_EMAIL: '이미 사용중인 이메일입니다.',
    NOT_DELETED: '데이터가 삭제되지 않았습니다.',
    INCORRECT_PASSWORD: '비밀번호가 일치하지 않습니다.',
    UNEXPECTED: '예상치 못합 오류가 발생했습니다.',
  };
  getHttpException(
    messageKey: keyof IExceptionMessage,
    status: HttpStatus,
  ): HttpException {
    return new HttpException(this.ExceptionMessage[messageKey], status);
  }

  getBadRequestException(message: string): BadRequestException {
    return new BadRequestException(message);
  }

  getNotFoundException(messageKey: keyof IExceptionMessage): NotFoundException {
    return new NotFoundException(this.ExceptionMessage[messageKey]);
  }

  getForbiddenException(
    messageKey: keyof IExceptionMessage,
  ): ForbiddenException {
    return new ForbiddenException(this.ExceptionMessage[messageKey]);
  }

  getUnauthorizedException(
    messageKey: keyof IExceptionMessage,
  ): UnauthorizedException {
    return new UnauthorizedException(this.ExceptionMessage[messageKey]);
  }

  getInternalSErverError(
    messageKey: keyof IExceptionMessage,
  ): InternalServerErrorException {
    return new InternalServerErrorException(this.ExceptionMessage[messageKey]);
  }
}
