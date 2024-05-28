import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { USER_CONSTANTS } from 'src/user/user.constants';

export class SignUpSchema {
    @IsEmail()
    @MaxLength(USER_CONSTANTS.DOMAIN.ENTITY.EMAIL.MAX_LENGTH)
    @ApiProperty()
    public readonly email: string;
  
    @IsString()
    @Length(
      USER_CONSTANTS.DOMAIN.ENTITY.PASSWORD.MIN_LENGTH,
      USER_CONSTANTS.DOMAIN.ENTITY.PASSWORD.MAX_LENGTH,
    )
    @ApiProperty()
    public readonly password: string;
}