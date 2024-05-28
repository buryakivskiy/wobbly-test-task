import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeormUserEntity} from './entities/typeorm-user.entity';
import { UserRepositoryProvider } from './providers/user-repository.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepositoryProvider],
  imports: [TypeOrmModule.forFeature([TypeormUserEntity])],
  exports: [UserService],
})
export class UserModule {}