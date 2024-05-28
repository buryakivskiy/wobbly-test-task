import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.service';
import { TypeormProductEntity } from './entities/typeorm-product.entity';
import { TypeormUserEntity } from 'src/user/entities/typeorm-user.entity';
import { ProductRepositoryProvider } from './providers/product-repository.provider';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepositoryProvider],
  imports: [TypeOrmModule.forFeature([TypeormProductEntity, TypeormUserEntity])],
  exports: [ProductService],
})
export class ProductModule {}