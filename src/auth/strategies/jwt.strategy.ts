import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtDto } from '../interfaces/jwt.dto';
import { AuthService } from '../services/auth.service';
import { IUserEntity } from 'src/user/interfaces/user-entity.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtDto): Promise<IUserEntity> {
    const user = await this.authService.validateUser(
      payload.username,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
