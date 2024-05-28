import { ICreateProduct } from './create-product.interface';
import { IProductEntity } from './product-entity.interface';

export interface IProductRepository {
    findById(id: number): Promise<IProductEntity>;

    find(): Promise<IProductEntity[]>;
  
    create(data: ICreateProduct): Promise<IProductEntity>;

    update(id: number, data: IProductEntity): Promise<void>;

    delete(id: number): Promise<void>;
}