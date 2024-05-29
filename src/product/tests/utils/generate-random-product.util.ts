import * as crypto from 'node:crypto';
import { IProductEntity } from 'src/product/interfaces/product-entity.interface';
import { generateRandomUser } from '../../../user/tests/utils/generate-random-user.util';

export function generateRandomProduct(
  partial?: Partial<IProductEntity>,
): IProductEntity {
  const random: IProductEntity = {
    id: crypto.randomInt(100),
    name: crypto.randomBytes(5).toString('hex'),
    description: crypto.randomBytes(5).toString('hex'),
    category: crypto.randomBytes(5).toString('hex'),
    price: crypto.randomInt(1, 100),
    updatedAt: new Date(),
    createdAt: new Date(),
    user: generateRandomUser(),
  };

  Object.assign(random, partial);

  return random;
}
