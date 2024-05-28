import { Exclude, Expose } from 'class-transformer';
import { IUserEntity } from '../interfaces/user-entity.interface';

@Exclude()
export class UserEntityResponse {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly email: string;

  @Expose()
  public readonly passwordHash: string;

  @Expose()
  public readonly createdAt: Date;

  constructor(user: IUserEntity) {
    Object.assign(this, user);
  }
}