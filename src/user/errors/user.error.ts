import { HttpException, HttpStatus } from '@nestjs/common';

export class UserError extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
  
  public static NotFound(): UserError {
    return new UserError('User not found', HttpStatus.BAD_REQUEST);
  }
  
  public static EmailAlreadyTaken(): UserError {
    return new UserError('Email already taken', HttpStatus.BAD_REQUEST);
  }
}