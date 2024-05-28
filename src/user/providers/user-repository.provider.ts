import { Provider } from '@nestjs/common';
import { USER_CONSTANTS } from '../user.constants';
import { TypeormUserRepository } from '../repositories/typeorm-user.repository';

export const UserRepositoryProvider: Provider = {
  useClass: TypeormUserRepository,
  provide: USER_CONSTANTS.APPLICATION.REPOSITORY_TOKEN,
};
