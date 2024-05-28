import { Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [PasswordService, AuthService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(
      {
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const secret = configService.getOrThrow('JWT_ACCESS_SECRET');
          const expiresIn = configService.getOrThrow('JWT_EXPIRATION_TIME');

          return {
            secret: secret,
            signOptions: { expiresIn: expiresIn }
          };
        },
      },
    ),
    UserModule,
  ],
})
export class AuthModule {}