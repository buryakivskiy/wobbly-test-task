import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductError extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
  
  public static NotFound(): ProductError {
    return new ProductError('Product not found', HttpStatus.BAD_REQUEST);
  }
}