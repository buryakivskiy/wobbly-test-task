import { Exclude, Expose } from 'class-transformer';
import { ISignUpResult } from '../interfaces/sign-up-result.interface';
import { UserEntityResponse } from 'src/user/responses/user-entity.response';

@Exclude()
export class SignUpResponse {
  @Expose()
  public readonly user: UserEntityResponse;

  @Expose()
  public readonly token: string;

  constructor(result: ISignUpResult) {
    this.user = new UserEntityResponse(result.user);
    this.token = result.token;
  }
}