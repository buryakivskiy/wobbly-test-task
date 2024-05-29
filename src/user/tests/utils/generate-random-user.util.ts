import * as crypto from 'node:crypto';
import { IUserEntity } from 'src/user/interfaces/user-entity.interface';

export function generateRandomUser(
  partial?: Partial<IUserEntity>,
): IUserEntity {
  const random: IUserEntity = {
    id: crypto.randomInt(100),
    email: `${crypto.randomBytes(5).toString('hex')}@gmail.com`,
    createdAt: new Date(),
    passwordHash: crypto.randomBytes(10).toString('hex')
  };

  Object.assign(random, partial);

  return random;
}