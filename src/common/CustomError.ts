import { HttpStatus } from '@nestjs/common';

export default class CustomError extends Error {
  static readonly CustomErrorName = 'CustomError';
  static readonly UnExpectedErrorMessage = '예기치 못한 에러가 발생하였습니다.';
  static readonly HttpStatus = HttpStatus;

  readonly name = CustomError.CustomErrorName;
  constructor(
    message?: string,
    readonly statusCode: HttpStatus = CustomError.HttpStatus
      .INTERNAL_SERVER_ERROR,
  ) {
    super(message);
  }
}
