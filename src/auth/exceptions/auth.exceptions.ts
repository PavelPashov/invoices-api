import { HttpException, HttpStatus } from '@nestjs/common';

export class IncorrectCredentialsException extends HttpException {
  constructor(
    message: string | object = 'Incorrect credentials',
    error = HttpStatus.UNAUTHORIZED,
  ) {
    super(message, error);
  }
}
