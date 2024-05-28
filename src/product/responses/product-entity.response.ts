import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IProductEntity } from '../interfaces/product-entity.interface';
import { UserEntityResponse } from 'src/user/responses/user-entity.response';

@Exclude()
export class ProductEntityResponse {
  @Expose()
  @ApiProperty()
  public readonly id: number;

  @Expose()
  @ApiProperty()
  public readonly name: string;

  @Expose()
  @ApiProperty()
  public readonly description: string;

  @Expose()
  @ApiProperty()
  public readonly category: string;

  @Expose()
  @ApiProperty()
  public readonly price: number;

  @Expose()
  @ApiProperty()
  public readonly user: UserEntityResponse;

  @Expose()
  @ApiProperty()
  public readonly createdAt: Date;

  constructor(product: IProductEntity) {
    Object.assign(this, product);
    this.user = new UserEntityResponse(product.user);
  }
}