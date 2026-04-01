/**
 * Custom error class for typed error handling
 */
export class AppError extends Error {
  statusCode: number;
  additional?: unknown;

  constructor(message: string, statusCode: number = 500, additional?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.additional = additional;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundException extends AppError {
  constructor() {
    super('Not found Exception', 404);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class BadRequestException extends AppError {
  constructor(message: string) {
    super(message || 'Bad Request Exception', 400);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}
