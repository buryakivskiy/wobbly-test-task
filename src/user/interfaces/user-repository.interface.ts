import { ICreateUser } from './create-user.interface';
import { IUserEntity } from './user-entity.interface';

export interface IUserRepository {
    findById(id: number): Promise<IUserEntity>;

    findByEmail(email: string): Promise<IUserEntity>;

    existsByEmail(email: string): Promise<boolean>;
  
    create(data: ICreateUser): Promise<IUserEntity>;
}
  