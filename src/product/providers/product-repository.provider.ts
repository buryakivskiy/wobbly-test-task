import { Provider } from '@nestjs/common';
import { PRODUCT_CONSTANTS } from '../product.constants';
import { TypeormProductRepository } from '../repositories/typeorm-product.repository';

export const ProductRepositoryProvider: Provider = {
  useClass: TypeormProductRepository,
  provide: PRODUCT_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
};
