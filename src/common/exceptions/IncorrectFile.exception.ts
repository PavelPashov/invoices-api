import { HttpException, HttpStatus } from '@nestjs/common';

class IncorrectFileException extends HttpException {
  constructor(
    message: string | object = 'Incorrect file format provided',
    error = HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  ) {
    super(message, error);
  }
}

export default IncorrectFileException;
