import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthError extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
  
  public static InvalidCredentials(): AuthError {
    return new AuthError('Access denied', HttpStatus.FORBIDDEN);
  }
}