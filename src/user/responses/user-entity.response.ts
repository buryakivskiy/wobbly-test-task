import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IUserEntity } from '../interfaces/user-entity.interface';

@Exclude()
export class UserEntityResponse {
  @Expose()
  @ApiProperty()
  public readonly id: number;

  @Expose()
  @ApiProperty()
  public readonly email: string;

  @Expose()
  @ApiProperty()
  public readonly passwordHash: string;

  @Expose()
  @ApiProperty()
  public readonly createdAt: Date;

  constructor(user: IUserEntity) {
    Object.assign(this, user);
  }
}