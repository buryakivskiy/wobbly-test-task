import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeormUserEntity} from './entities/typeorm-user.entity';
import { UserRepositoryProvider } from './providers/user-repository.provider';
import { TypeormProductEntity } from 'src/product/entities/typeorm-product.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepositoryProvider],
  imports: [TypeOrmModule.forFeature([TypeormUserEntity, TypeormProductEntity])],
  exports: [UserService],
})
export class UserModule {}