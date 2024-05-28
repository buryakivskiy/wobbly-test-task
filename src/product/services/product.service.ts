import { Inject, Injectable } from '@nestjs/common';
import { ProductError } from '../errors/product.error';
import { PRODUCT_CONSTANTS } from '../product.constants';
import { IProductEntity } from '../interfaces/product-entity.interface';
import { ICreateProduct } from '../interfaces/create-product.interface';
import { IUserEntity } from 'src/user/interfaces/user-entity.interface';
import { IUpdateProduct } from '../interfaces/update-product.interface';
import { IProductRepository } from '../interfaces/product-repository.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_CONSTANTS.APPLICATION.REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  public async findById(id: number): Promise<IProductEntity> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw ProductError.NotFound();
    }

    return product;
  }

  public async find(): Promise<IProductEntity[]> {
    return this.productRepository.find();
  }

  public async create(payload: ICreateProduct): Promise<IProductEntity> {
    try {
        const product = await this.productRepository.create(payload);

        return product;
    } catch (error) {
        throw error;
    }
  }

  public async update(payload: IUpdateProduct): Promise<IProductEntity> {
    const product = await this.productRepository.findById(payload.id);

    if (!product) {
      throw ProductError.NotFound();
    }

    if (product.user.id != payload.user.id) {
      throw ProductError.NotFound();
    }

    const updatedProduct: IProductEntity = {
      ...product,
      ...payload.product,
    }

    await this.productRepository.update(product.id, updatedProduct);

    return updatedProduct;
  }

  public async delete(id: number, user: IUserEntity): Promise<IProductEntity> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw ProductError.NotFound();
    }

    if (product.user.id != user.id) {
      throw ProductError.NotFound();
    }

    await this.productRepository.delete(product.id);

    return product;
  }
}