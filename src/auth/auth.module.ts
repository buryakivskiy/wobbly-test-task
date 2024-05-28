import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordService } from './services/password.service';

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