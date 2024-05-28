import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { IUserEntity } from 'src/user/interfaces/user-entity.interface';
import { JwtService } from '@nestjs/jwt';
import { ISignInResult } from '../interfaces/sign-in-result.interface';
import { PasswordService } from './password.service';
import { AuthError } from '../errors/auth.error';
import { ISignUpResult } from '../interfaces/sign-up-result.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(email: string, password: string): Promise<ISignInResult> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw AuthError.InvalidCredentials();
    }

    const passwordValid = this.passwordService.validatePassword(password, user.passwordHash);

    if (!passwordValid) {
      throw AuthError.InvalidCredentials();
    }

    return {
      authorized: true,
      token: this.jwtService.sign({
        username: user.email
      })
    }
  }

  public async signUp(email: string, password: string): Promise<ISignUpResult> {
    const user = await this.userService.create({
      email,
      passwordHash: await this.passwordService.hashPassword(password)
    });

    return {
      user: user,
      token: this.jwtService.sign({
        username: user.email
      })
    };
  }

  public async validateUser(email: string): Promise<IUserEntity> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      return user;
    }

    return null;
  }
}