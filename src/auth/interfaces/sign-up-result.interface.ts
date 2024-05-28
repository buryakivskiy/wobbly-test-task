import { IUserEntity } from 'src/user/interfaces/user-entity.interface';

export interface ISignUpResult {
    readonly user: IUserEntity;
  
    readonly token: string;
}