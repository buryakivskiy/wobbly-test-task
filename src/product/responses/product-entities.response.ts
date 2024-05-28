import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ProductEntityResponse } from './product-entity.response';
import { IProductEntity } from '../interfaces/product-entity.interface';

@Exclude()
export class ProductEntitiesResponse {
  @Expose()
  @ApiProperty({ type: [ProductEntityResponse] })
  public readonly products: ProductEntityResponse[];

  constructor(products: IProductEntity[]) {
    this.products = products.map((product) => new ProductEntityResponse(product));
  }
}