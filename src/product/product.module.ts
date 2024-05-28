import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormProductEntity } from './entities/typeorm-product.entity';
import { TypeormUserEntity } from 'src/user/entities/typeorm-user.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [TypeOrmModule.forFeature([TypeormProductEntity, TypeormUserEntity])],
  exports: [],
})
export class UserModule {}