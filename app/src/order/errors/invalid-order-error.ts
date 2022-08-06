import { HttpStatus } from '@nestjs/common';

export class InvalidOrderError extends Error {
  public static STATUS_CODE = HttpStatus.NOT_FOUND;
  public static ERROR_CODE = 'ORDER_00001';
  public static ERROR_MESSAGE = 'Invalid Order';

  constructor(message = InvalidOrderError.ERROR_MESSAGE) {
    super(message);
  }

  public getResponse() {
    return {
      error_code: InvalidOrderError.ERROR_CODE,
      error_message: this.message,
    };
  }
}
