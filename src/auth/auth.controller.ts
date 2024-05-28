import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignUpSchema } from './schemas/sign-up.schema';
import { SignUpResponse } from './responses/sign-up.response';
import { SignInSchema } from './schemas/sign-in.schema';
import { SignInResponse } from './responses/sign-in.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signUp')
  public async signUp(
    @Body() schema: SignUpSchema,
  ): Promise<SignUpResponse> {
    const result = await this.authService.signUp(schema.email, schema.password);

    return new SignUpResponse(result);
  }

  @Post('signIn')
  public async signIn(
    @Body() schema: SignInSchema,
  ): Promise<SignInResponse> {
    const result = await this.authService.signIn(schema.email, schema.password);

    return new SignInResponse(result);
  }
}