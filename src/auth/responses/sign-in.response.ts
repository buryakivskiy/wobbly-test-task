import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ISignInResult } from '../interfaces/sign-in-result.interface';

@Exclude()
export class SignInResponse {
  @Expose()
  @ApiProperty()
  public readonly authorized: boolean;

  @Expose()
  @ApiProperty()
  public readonly token: string;

  constructor(result: ISignInResult) {
    this.authorized = result.authorized;
    this.token = result.token;
  }
}