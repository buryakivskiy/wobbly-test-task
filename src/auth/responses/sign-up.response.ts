import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ISignUpResult } from '../interfaces/sign-up-result.interface';
import { UserEntityResponse } from 'src/user/responses/user-entity.response';

@Exclude()
export class SignUpResponse {
  @Expose()
  @ApiProperty()
  public readonly user: UserEntityResponse;

  @Expose()
  @ApiProperty()
  public readonly token: string;

  constructor(result: ISignUpResult) {
    this.user = new UserEntityResponse(result.user);
    this.token = result.token;
  }
}