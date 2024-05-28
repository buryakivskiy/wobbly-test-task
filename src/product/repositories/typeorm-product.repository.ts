import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductEntity } from '../interfaces/product-entity.interface';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { TypeormProductEntity } from '../entities/typeorm-product.entity';
import { IProductRepository } from '../interfaces/product-repository.interface';

@Injectable()
export class TypeormProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(TypeormProductEntity)
    private readonly productRepository: Repository<TypeormProductEntity>,
  ) {}

  public async findById(id: number): Promise<IProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user']
  });

    return product;
  }

  public async find(): Promise<IProductEntity[]> {
    const products = await this.productRepository.find({ relations: ['user'] });

    return products;
  }

  public async create(data: ICreateProduct): Promise<IProductEntity> {
    const product = this.productRepository.create(data);

    return this.productRepository.save(product);
  }

  public async update(id: number, data: IProductEntity): Promise<void> {
    await this.productRepository.update(id, data);
  }

  public async delete(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}