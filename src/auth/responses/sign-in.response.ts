import { Exclude, Expose } from 'class-transformer';
import { UserEntityResponse } from 'src/user/responses/user-entity.response';
import { ISignInResult } from '../interfaces/sign-in-result.interface';

@Exclude()
export class SignInResponse {
  @Expose()
  public readonly authorized: boolean;

  @Expose()
  public readonly token: string;

  constructor(result: ISignInResult) {
    this.authorized = result.authorized;
    this.token = result.token;
  }
}